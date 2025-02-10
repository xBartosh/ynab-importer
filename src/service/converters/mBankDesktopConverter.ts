import { NewTransaction } from "ynab";

export const MBankDesktopConverter = async (
    file: File,
    accountId: string
): Promise<NewTransaction[]> => {
    const CSV_HEADER = "#Data operacji;#Opis operacji;#Rachunek;#Kategoria;#Kwota;";
    const transactions: NewTransaction[] = [];

    const fileText = await file.text();

    const lines = fileText.split("\n");

    const startIndex = lines.findIndex(line => line.includes(CSV_HEADER));
    if (startIndex === -1) {
        console.error("Header not found in the CSV file.");
        return [];
    }

    const dataLines = lines.slice(startIndex + 1);

    for (const row of dataLines) {
        const cleanedRow = row.replace(/["']/g, "").trim();
        if (!cleanedRow) {
            continue;
        }

        const splitted = cleanedRow.split(";");

        if (splitted.length < 6) {
            console.warn(`Wiersz ma za mało kolumn: ${cleanedRow}`);
            continue;
        }

        const dateStr = splitted[0].trim();
        const rawAmount = splitted[splitted.length - 3].trim();

        const titleParts = splitted.slice(1, splitted.length - 5);
        const title = titleParts.join(" ").trim();

        const processedAmountStr = rawAmount
            .replace(/\s/g, "")
            .replace("PLN", "")
            .replace(",", ".");

        let amountValue: number;
        try {
            amountValue = parseFloat(processedAmountStr);
            if (isNaN(amountValue)) {
                throw new Error("amount is NaN");
            }
        } catch {
            console.warn(`Invalid amount: ${processedAmountStr}`);
            continue;
        }

        const transaction: NewTransaction = {
            date: dateStr,
            amount: Math.round(amountValue * 1000), // YNAB expects amounts in milliunits
            payee_name: title.slice(0, 100),
            cleared: "cleared",
            approved: false,
            account_id: accountId,
        };

        transactions.push(transaction);
    }

    return transactions;
};
