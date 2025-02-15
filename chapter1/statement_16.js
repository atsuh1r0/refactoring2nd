function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en−US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format;
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf); // 注文の内訳を出力
        result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
            perf.audience
        } seats)\n`;
        totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}
