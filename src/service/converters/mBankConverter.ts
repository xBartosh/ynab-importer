import { NewTransaction } from "ynab";

export const mBankConverter = async (file: File, accountId: string): Promise<Array<NewTransaction>> => {
    const CSV_HEADER = "#Data operacji;#Opis operacji;#Rachunek;#Kategoria;#Kwota;";

    const transactions: Array<NewTransaction> = [];

    // Read the file as text
    const fileText = await file.text();

    // Split file content into lines
    const lines = fileText.split("\n");

    // 1. Find the header line index
    const startIndex = lines.findIndex(line => line.includes(CSV_HEADER));

    if (startIndex === -1) {
        console.error("Header not found in the CSV file.");
        return [];
    }

    // 2. Parse lines AFTER the header line
    const dataLines = lines.slice(startIndex + 1);

    // Regular expression to parse each line
    const lineRegex = /^([^;]+);"(.*?)";"(.*?)";"(.*?)";([^;]+);;$/;

    for (const row of dataLines) {
        const trimmedRow = row.trim();

        // Skip empty lines
        if (!trimmedRow) {
            continue;
        }

        // Match the row with the regex
        const match = trimmedRow.match(lineRegex);

        if (!match) {
            console.warn(`Row does not match the expected format: ${trimmedRow}`);
            continue;
        }

        // Extract columns
        const [, dateStr, title, account, category, amountStr] = match;

        console.log(dateStr, title, account, category, amountStr);

        // Process the amount
        const processedAmountStr = amountStr.trim().replace(" ", "").replace("PLN", "").replace(",", ".");

        // Convert amount to number
        let amountValue: number;
        try {
            amountValue = parseFloat(processedAmountStr);
        } catch {
            console.warn(`Invalid amount: ${processedAmountStr}`);
            continue;
        }

        // Create a NewTransaction object
        const transaction: NewTransaction = {
            date: dateStr,
            amount: Math.round(amountValue * 1000), // YNAB expects amounts in milliunits
            payee_name: title.slice(0, 100), // Assuming title is the payee
            cleared: "cleared",
            approved: false,
            account_id: accountId
        };

        transactions.push(transaction);
    }

    return transactions;
};
