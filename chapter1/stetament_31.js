// import createStatementData from "./createStatementData.js";
// function statement(invoice, plays) {
//     return renderPlainText(createStatementData(invoice, plays));
// }
// function renderPlainText(data) {
//     let result = `Statement for ${data.customer}\n`;
//     for (let perf of data.performances) {
//         result += ` ${perf.play.name}: ${usd(perf.amount)} (${
//             perf.audience
//         } seats)\n`;
//     }
//     result += `Amount owed is ${usd(data.totalAmount)}\n`;
//     result += `You earned ${data.totalVolumeCredits} credits\n`;
//     return result;
// }
// function htmlStatement(invoice, plays) {
//     return renderHtml(createStatementData(invoice, plays));
// }
// function renderHtml(data) {
//     let result = `<h1>Statement for ${data.customer}</h1>\n`;
//     result += "<table>\n";
//     result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
//     for (let perf of data.performances) {
//         result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
//         result += `<td>${usd(perf.amount)}</td></tr>\n`;
//     }
//     result += "</table>\n";
//     result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
//     result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
//     return result;
// }
// function usd(aNumber) {
//     return new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//         minimumFractionDigits: 2,
//     }).format(aNumber / 100);
// }

export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;
    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
    function amountFor(aPerformance) {
        let result = 0;
        switch (aPerformance.play.type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${aPerformance.play.type}`);
        }
        return result;
    }
    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }
    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }
    function totalVolumeCredits(data) {
        return data.performances.reduce(
            (total, p) => total + p.volumeCredits,
            0
        );
    }
}
