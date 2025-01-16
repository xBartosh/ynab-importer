import { NewTransaction } from "ynab";

export const MBankMobileConverter = async (file: File, accountId: string): Promise<Array<NewTransaction>> => {
    // CSV header defining the data structure
    const CSV_HEADER = "#Data ksi";

    const transactions: Array<NewTransaction> = [];

    // Read the file as text
    const fileText = await file.text();

    // Split the file content into lines
    const lines = fileText.split("\n");

    // Remove all quotes and apostrophes from the lines
    const sanitizedLines = lines.map(line => line.replace(/["']/g, ""));

    // 1. Find the index of the header line
    const startIndex = sanitizedLines.findIndex(line => line.includes(CSV_HEADER));

    if (startIndex === -1) {
        console.error("Header not found in the CSV file.");
        return [];
    }

    // 2. Process lines after the header
    const dataLines = sanitizedLines.slice(startIndex + 1);

    // Regular expression to parse each line
    const lineRegex = /^([^;]+);([^;]+);([^;]+);([^;]*);([^;]*);([^;]*);(-?\d+[.,]\d+);.*$/;

    for (const row of dataLines) {
        const trimmedRow = row.trim();

        // Skip empty lines
        if (!trimmedRow) {
            continue;
        }

        // Match the row with the regular expression
        const match = trimmedRow.match(lineRegex);

        if (!match) {
            console.warn(`Row does not match the expected format: ${trimmedRow}`);
            continue;
        }

        // Extract columns
        const [, bookingDate, operationDate, description, title, payee, accountNumber, amountStr] = match;

        console.log(bookingDate, operationDate, description, title, payee, accountNumber, amountStr);

        // Process the amount
        const processedAmountStr = amountStr.trim().replace(",", ".");

        // Convert amount to a number
        let amountValue: number;
        try {
            amountValue = parseFloat(processedAmountStr);
        } catch {
            console.warn(`Invalid amount: ${processedAmountStr}`);
            continue;
        }

        // Create a NewTransaction object
        const transaction: NewTransaction = {
            date: bookingDate, // Booking date
            amount: Math.round(amountValue * 1000), // YNAB expects amounts in milliunits
            payee_name: title.slice(0, 100), // Operation description as payee
            cleared: "cleared", // Transaction is cleared
            approved: false, // Not approved (can be adjusted as needed)
            account_id: accountId // Provided account ID
        };

        transactions.push(transaction);
    }

    return transactions;
};
