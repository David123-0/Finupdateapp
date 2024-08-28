document.addEventListener('DOMContentLoaded', function () {
    // Add Inflow
    document.getElementById('add-inflow').addEventListener('click', function () {
        let inflowSection = document.getElementById('inflow-section');
        let newInflow = document.createElement('div');
        newInflow.classList.add('inflow-item');
        newInflow.innerHTML = `
            <input type="text" placeholder="Title of Inflow">
            <input type="number" placeholder="Amount in Naira" class="inflow-naira">
            <input type="number" placeholder="Amount in Dollars" class="inflow-dollar">
            <input type="date" placeholder="Date">
        `;
        inflowSection.insertBefore(newInflow, inflowSection.children[inflowSection.children.length - 3]);
        calculateTotals();
    });

    // Add Disbursement
    document.getElementById('add-disbursement').addEventListener('click', function () {
        let disbursementSection = document.getElementById('disbursement-section');
        let newDisbursement = document.createElement('div');
        newDisbursement.classList.add('disbursement-item');
        newDisbursement.innerHTML = `
            <input type="text" placeholder="Title of Disbursement">
            <input type="number" placeholder="Amount in Naira" class="disbursement-naira">
            <input type="number" placeholder="Amount in Dollars" class="disbursement-dollar">
            <input type="date" placeholder="Date">
        `;
        disbursementSection.insertBefore(newDisbursement, disbursementSection.children[disbursementSection.children.length - 3]);
        calculateTotals();
    });

    // Calculate totals for inflow and disbursement
    function calculateTotals() {
        let totalInflowNaira = 0, totalInflowDollar = 0;
        document.querySelectorAll('.inflow-naira').forEach(input => totalInflowNaira += parseFloat(input.value) || 0);
        document.querySelectorAll('.inflow-dollar').forEach(input => totalInflowDollar += parseFloat(input.value) || 0);

        let totalDisbursementNaira = 0, totalDisbursementDollar = 0;
        document.querySelectorAll('.disbursement-naira').forEach(input => totalDisbursementNaira += parseFloat(input.value) || 0);
        document.querySelectorAll('.disbursement-dollar').forEach(input => totalDisbursementDollar += parseFloat(input.value) || 0);

        document.getElementById('total-inflow-naira').textContent = totalInflowNaira.toFixed(2);
        document.getElementById('total-inflow-dollar').textContent = totalInflowDollar.toFixed(2);
        document.getElementById('total-disbursement-naira').textContent = totalDisbursementNaira.toFixed(2);
        document.getElementById('total-disbursement-dollar').textContent = totalDisbursementDollar.toFixed(2);

        // Update balance calculations
        const balanceNaira = parseFloat(document.getElementById('balance-naira').value) || 0;
        const balanceDollar = parseFloat(document.getElementById('balance-dollars').value) || 0;
        const updatedBalanceNaira = balanceNaira + totalInflowNaira - totalDisbursementNaira;
        const updatedBalanceDollar = balanceDollar + totalInflowDollar - totalDisbursementDollar;

        document.getElementById('updated-balance-naira').textContent = updatedBalanceNaira.toFixed(2);
        document.getElementById('updated-balance-dollars').textContent = updatedBalanceDollar.toFixed(2);
    }

    // Save to PDF
    document.getElementById('save-pdf').addEventListener('click', function () {
        html2canvas(document.getElementById('form-container'), { scale: 2 }).then(canvas => {
            const { jsPDF } = window.jspdf;
            let pdf = new jsPDF('p', 'mm', 'a4');
            let imgData = canvas.toDataURL('image/png');
            let pdfWidth = pdf.internal.pageSize.getWidth();
            let pdfHeight = pdf.internal.pageSize.getHeight();
            let imgHeight = canvas.height * pdfWidth / canvas.width;
            if (imgHeight > pdfHeight) {
                imgHeight = pdfHeight;
                let imgWidth = canvas.width * imgHeight / canvas.height;
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            } else {
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            }
            pdf.save('receipt.pdf');
        });
    });

    // Recalculate totals when values change
    document.getElementById('inflow-section').addEventListener('input', calculateTotals);
    document.getElementById('disbursement-section').addEventListener('input', calculateTotals);
    document.getElementById('balance-naira').addEventListener('input', calculateTotals);
    document.getElementById('balance-dollars').addEventListener('input', calculateTotals);
});
