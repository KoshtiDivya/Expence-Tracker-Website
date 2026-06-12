const form = document.getElementById("form-expence");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const list = document.getElementById("transaction-list");
const balance = document.getElementById("balance");
const saving = document.getElementById("saving");
const expenseTotal = document.getElementById("expense-total");
const downloadBtn = document.getElementById("download-btn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveToLocalStorage() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


function updateBalance() {
    let totalIncome = 0;
    let totalExpense = 0;

transactions.forEach((item) => {

    if (item.type === "income") {
        totalIncome += item.amount;
    } else {
        totalExpense += item.amount;
    }

});

const totalSaving = totalIncome - totalExpense;

balance.innerText = `₹${totalIncome}`;
saving.innerText = `₹${totalSaving}`;
expenseTotal.innerText = `₹${totalExpense}`;

}

function displayTransactions() {
    const recentTransactions = transactions.slice(-5).reverse();

    list.innerHTML = "";

    recentTransactions.forEach((item,index) => {

        const li = document.createElement("li");

        li.classList.add(item.type);

        li.innerHTML = `
            <div>
            <span id="item-desc">
                ${item.description}
            </span>
            <span id="item-amount"> ${item.type === "income" ? "+" : "-"} ₹${item.amount} </span>
            </div>
            <button
                class="delete-btn"
                onclick="deleteTransaction(${transactions.length - 1 - index})"
            >
                <p id="del"> Delete </p>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
            </button>
        `;

        list.appendChild(li);

    });

    updateBalance();
}

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const transaction = {

        description: description.value,
        amount: Number(amount.value),
        type: type.value

    };

    transactions.push(transaction);

    saveToLocalStorage();

    displayTransactions();
    alert("Transaction Added Successfully1!");
    form.reset();

});

function deleteTransaction(index){

    transactions.splice(index,1);

    saveToLocalStorage();

    displayTransactions();
}

displayTransactions();

downloadBtn.addEventListener("click", downloadPdf);

function downloadPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Expense Tracker Report", 14, 20);

    const tableData = transactions.map((item, index) => [
        index + 1,
        item.description,
        item.type,
        `Rs.${item.amount}`
    ]);

    const incomeValue = balance.textContent.replace("₹", "");
    const expenseValue = expenseTotal.textContent.replace("₹", "");
    const savingValue = saving.textContent.replace("₹", "");
    
    doc.text(`Total Income: Rs. ${incomeValue}`, 14, 30);
    doc.text(`Total Expense: Rs. ${expenseValue}`, 14, 40);
    doc.text(`Total Savings: Rs. ${savingValue}`, 14, 50);

    doc.autoTable({
        startY: 60,
        head: [
            ["#", "Description", "Type", "Amount"]
        ],
        body: tableData
    });

    doc.save("Expence_Report.pdf");
}