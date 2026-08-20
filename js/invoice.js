/**
 * ============================================================
 * INVOICE CONFIG — edit this section
 * ============================================================
 *
 * firebaseConfig  — from Firebase Console > Project settings > Your apps
 * allowedEmail    — only this Google account can open the generator
 * business        — details printed on every invoice
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
    initializeAuth,
    getAuth,
    indexedDBLocalPersistence,
    browserLocalPersistence,
    browserPopupRedirectResolver,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const INVOICE_CONFIG = {
    firebaseConfig: {
        apiKey: "AIzaSyDRsH2A5ZhLdyzBUBue_SQY_3k7UOIp0ak",
        authDomain: "invoices-c487c.firebaseapp.com",
        projectId: "invoices-c487c",
        storageBucket: "invoices-c487c.firebasestorage.app",
        messagingSenderId: "34700993194",
        appId: "1:34700993194:web:01869ff07d604cfd88e6d3",
        measurementId: "G-C08QQ7RNH5"
    },
    allowedEmail: "jmhamuzah@gmail.com",
    business: {
        name: "Yakobo Web Development Firm",
        logo: "assets/images/logo.png",
        phone: "+265 990 705 194",
        email: "jmhamuzah@gmail.com",
        website: "",
        address: "Malawi",
        payment: "Payment is due by the invoice due date. Bank transfer or mobile money details can be confirmed on request.",
        terms: "This invoice is payable in full by the due date. Work remains the property of Yakobo Web Development Firm until payment is received."
    }
};

const host = window.location.hostname;
const isLocalHost = host === "localhost" || host === "127.0.0.1" || host === "";
const firebaseConfig = Object.assign({}, INVOICE_CONFIG.firebaseConfig, {
    authDomain: isLocalHost ? INVOICE_CONFIG.firebaseConfig.authDomain : host
});

const firebaseApp = initializeApp(firebaseConfig);
let auth;
try {
    auth = initializeAuth(firebaseApp, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver
    });
} catch (err) {
    auth = getAuth(firebaseApp);
}
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const BUSINESS = INVOICE_CONFIG.business;
const ALLOWED_EMAIL = String(INVOICE_CONFIG.allowedEmail).trim().toLowerCase();

const gate = document.getElementById("invoice-gate");
const denied = document.getElementById("invoice-denied");
const appEl = document.getElementById("invoice-app");
const body = document.getElementById("items-body");
const preview = document.getElementById("invoice-preview");
const statusEl = document.getElementById("invoice-status");
const setupEl = document.getElementById("google-setup");
const googleBtn = document.getElementById("btn-google");

let started = false;
let denyLock = false;
let authReady = false;
let logoData = "";
const REDIRECT_KEY = "yakobo-invoice-redirect";

function currencyCode() {
    const el = document.getElementById("currency");
    return el && el.value ? el.value : "MWK";
}

function pad(n) {
    return String(n).padStart(2, "0");
}

function todayISO() {
    const d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function addDaysISO(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function nextInvoiceNumber() {
    const year = new Date().getFullYear();
    const draftKey = "yakobo-invoice-draft-" + year;
    const draft = localStorage.getItem(draftKey);
    if (draft) return draft;
    const seqKey = "yakobo-invoice-seq-" + year;
    const seq = parseInt(localStorage.getItem(seqKey) || "0", 10) + 1;
    localStorage.setItem(seqKey, String(seq));
    const num = "INV-" + year + "-" + String(seq).padStart(4, "0");
    localStorage.setItem(draftKey, num);
    return num;
}

function bumpInvoiceNumber() {
    localStorage.removeItem("yakobo-invoice-draft-" + new Date().getFullYear());
}

function money(value) {
    let n = Number(value);
    if (!isFinite(n)) n = 0;
    return currencyCode() + " " + n.toLocaleString("en-MW", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escapeHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function val(id) {
    const el = document.getElementById(id);
    return el ? String(el.value || "").trim() : "";
}

function num(id) {
    const n = parseFloat(val(id));
    return isFinite(n) && n > 0 ? n : 0;
}

function formatDate(iso) {
    if (!iso) return "—";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return parts[2] + "/" + parts[1] + "/" + parts[0];
}

function fileName() {
    const number = val("invoice-number") || "INV";
    const firm = BUSINESS.name.replace(/\s+/g, "-").replace(/[^A-Za-z0-9-]/g, "");
    return number + "-" + firm + ".pdf";
}

function hideAll() {
    gate.hidden = true;
    denied.hidden = true;
    appEl.hidden = true;
}

function showGate() {
    hideAll();
    gate.hidden = false;
}

function showDenied() {
    hideAll();
    denied.hidden = false;
}

function showApp() {
    hideAll();
    appEl.hidden = false;
    if (!started) {
        started = true;
        startGenerator();
    }
}

function setAuthMessage(message) {
    if (!setupEl) return;
    if (!message) {
        setupEl.hidden = true;
        setupEl.textContent = "";
        return;
    }
    setupEl.hidden = false;
    setupEl.textContent = message;
}

function authErrorMessage(err) {
    const code = err && err.code;
    if (code === "auth/unauthorized-domain") {
        return "This domain is not authorised in Firebase. Add developers-yakobofirm.vercel.app under Authentication → Settings → Authorized domains.";
    }
    if (code === "auth/operation-not-allowed") {
        return "Google sign-in is not enabled in Firebase. Enable it under Authentication → Sign-in method.";
    }
    if (code === "auth/account-exists-with-different-credential") {
        return "This email is already linked to a different sign-in method.";
    }
    if (code === "auth/network-request-failed") {
        return "Network error during Google sign-in. Check your connection and try again.";
    }
    if (code === "auth/internal-error") {
        return "Google sign-in hit an internal error. Try again.";
    }
    if (code === "auth/invalid-api-key") {
        return "Firebase API key is invalid. Check the firebaseConfig in js/invoice.js.";
    }
    if (err && err.message) {
        return "Google sign-in failed: " + err.message;
    }
    return "Google sign-in did not complete. Try again.";
}

async function handleUser(user) {
    googleBtn.disabled = false;

    if (!authReady && !user) {
        return;
    }

    if (denyLock && !user) {
        showDenied();
        return;
    }

    if (!user) {
        denyLock = false;
        showGate();
        return;
    }

    const email = String(user.email || "").trim().toLowerCase();
    if (email !== ALLOWED_EMAIL) {
        denyLock = true;
        showDenied();
        try {
            await signOut(auth);
        } catch (err) {
            setAuthMessage(authErrorMessage(err));
        }
        return;
    }

    denyLock = false;
    setAuthMessage("");
    showApp();
}

async function signInGoogle() {
    setAuthMessage("Redirecting to Google…");
    googleBtn.disabled = true;
    try {
        if (/\/invoice\.html$/i.test(window.location.pathname)) {
            history.replaceState({}, "", "/invoice/");
        }
        sessionStorage.setItem(REDIRECT_KEY, "1");
        await signInWithRedirect(auth, googleProvider);
    } catch (err) {
        sessionStorage.removeItem(REDIRECT_KEY);
        googleBtn.disabled = false;
        setAuthMessage(authErrorMessage(err));
    }
}

async function bootAuth() {
    if (/\/invoice\.html$/i.test(window.location.pathname)) {
        history.replaceState({}, "", "/invoice/");
    }

    const pending = sessionStorage.getItem(REDIRECT_KEY) === "1";
    if (pending) {
        setAuthMessage("Signing you in…");
        googleBtn.disabled = true;
        showGate();
    }

    try {
        const result = await getRedirectResult(auth);
        sessionStorage.removeItem(REDIRECT_KEY);
        authReady = true;

        if (result && result.user) {
            setAuthMessage("");
            await handleUser(result.user);
        } else if (pending && !auth.currentUser) {
            googleBtn.disabled = false;
            showGate();
            setAuthMessage("Google signed you in, but this page could not keep the session. Add developers-yakobofirm.vercel.app under Firebase Authentication → Settings → Authorized domains, then try again.");
        } else if (pending) {
            setAuthMessage("");
        }
    } catch (err) {
        sessionStorage.removeItem(REDIRECT_KEY);
        authReady = true;
        googleBtn.disabled = false;
        showGate();
        setAuthMessage(authErrorMessage(err));
    }

    onAuthStateChanged(auth, handleUser);
}

async function firebaseSignOut() {
    denyLock = false;
    try {
        await signOut(auth);
    } catch (err) {
        setAuthMessage(authErrorMessage(err));
        showGate();
    }
}

function addRow(data) {
    data = data || {};
    const tr = document.createElement("tr");
    tr.innerHTML =
        '<td><input type="text" class="item-desc" placeholder="Website design" value="' +
        escapeHtml(data.desc || "") +
        '"></td>' +
        '<td class="col-qty"><input type="number" class="item-qty" min="0" step="0.01" value="' +
        escapeHtml(data.qty != null ? data.qty : 1) +
        '"></td>' +
        '<td class="col-price"><input type="number" class="item-price" min="0" step="0.01" value="' +
        escapeHtml(data.price != null ? data.price : "") +
        '"></td>' +
        '<td class="col-total"><span class="line-total">—</span></td>' +
        '<td class="col-remove"><button class="item-remove" type="button" aria-label="Remove item">&times;</button></td>';
    body.appendChild(tr);
}

function items() {
    return Array.prototype.map.call(body.querySelectorAll("tr"), function (tr) {
        let qty = parseFloat(tr.querySelector(".item-qty").value);
        let price = parseFloat(tr.querySelector(".item-price").value);
        if (!isFinite(qty) || qty < 0) qty = 0;
        if (!isFinite(price) || price < 0) price = 0;
        return {
            desc: tr.querySelector(".item-desc").value.trim(),
            qty: qty,
            price: price,
            total: qty * price
        };
    });
}

function totals() {
    const list = items();
    const subtotal = list.reduce(function (sum, item) {
        return sum + item.total;
    }, 0);
    let discount = num("discount");
    if (discount > subtotal) discount = subtotal;
    const taxable = subtotal - discount;
    const taxRate = num("tax");
    const tax = taxable * (taxRate / 100);
    return {
        items: list,
        subtotal: subtotal,
        discount: discount,
        taxRate: taxRate,
        tax: tax,
        grand: taxable + tax
    };
}

function contactLines() {
    return [BUSINESS.phone, BUSINESS.email, BUSINESS.website, BUSINESS.address].filter(Boolean);
}

function extraBlock(title, text) {
    if (!text) return "";
    return '<div class="inv-notes"><strong>' + title + "</strong><p>" + escapeHtml(text) + "</p></div>";
}

function renderPreview() {
    const t = totals();
    document.querySelectorAll("[data-currency-label]").forEach(function (el) {
        el.textContent = currencyCode();
    });
    body.querySelectorAll("tr").forEach(function (tr, i) {
        tr.querySelector(".line-total").textContent = money(t.items[i].total);
    });

    let rows = t.items
        .filter(function (item) {
            return item.desc || item.qty || item.price;
        })
        .map(function (item) {
            return (
                "<tr><td>" +
                escapeHtml(item.desc || "—") +
                "</td><td>" +
                item.qty +
                "</td><td>" +
                money(item.price) +
                "</td><td>" +
                money(item.total) +
                "</td></tr>"
            );
        })
        .join("");

    if (!rows) rows = '<tr><td colspan="4">No items yet</td></tr>';

    preview.innerHTML =
        '<div class="inv-top">' +
        '<div class="inv-brand">' +
        '<img src="' +
        escapeHtml(BUSINESS.logo) +
        '" alt="">' +
        "<div><h3>" +
        escapeHtml(BUSINESS.name) +
        "</h3><p>" +
        contactLines().map(escapeHtml).join("<br>") +
        "</p></div></div>" +
        '<div class="inv-meta"><strong>INVOICE</strong>' +
        "<p>No. " +
        escapeHtml(val("invoice-number") || "—") +
        "<br>Date " +
        formatDate(val("invoice-date")) +
        "<br>Due " +
        formatDate(val("due-date")) +
        "<br>" +
        escapeHtml(currencyCode()) +
        "</p></div></div>" +
        '<div class="inv-parties">' +
        '<div class="inv-party"><span>Bill to</span><p>' +
        ([val("customer-name"), val("company-name"), val("customer-phone"), val("customer-email"), val("customer-address")]
            .filter(Boolean)
            .map(escapeHtml)
            .join("<br>") || "—") +
        "</p></div>" +
        '<div class="inv-party"><span>From</span><p>' +
        escapeHtml(BUSINESS.name) +
        "<br>" +
        contactLines().map(escapeHtml).join("<br>") +
        "</p></div></div>" +
        '<table class="inv-table"><thead><tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead><tbody>' +
        rows +
        "</tbody></table>" +
        '<div class="inv-totals">' +
        "<div><span>Subtotal</span><span>" +
        money(t.subtotal) +
        "</span></div>" +
        "<div><span>Discount</span><span>" +
        money(t.discount) +
        "</span></div>" +
        "<div><span>Tax / VAT (" +
        t.taxRate +
        "%)</span><span>" +
        money(t.tax) +
        "</span></div>" +
        '<div class="grand"><span>Grand total</span><span>' +
        money(t.grand) +
        "</span></div></div>" +
        extraBlock("Payment information", val("payment")) +
        extraBlock("Notes", val("notes")) +
        extraBlock("Terms and conditions", val("terms"));
}

function setStatus(message, kind) {
    statusEl.textContent = message || "";
    statusEl.className = "invoice-status" + (kind ? " is-" + kind : "");
}

function loadLogo() {
    return new Promise(function (resolve) {
        if (logoData) {
            resolve(logoData);
            return;
        }
        const img = new Image();
        img.onload = function () {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth || 200;
                canvas.height = img.naturalHeight || 200;
                canvas.getContext("2d").drawImage(img, 0, 0);
                logoData = canvas.toDataURL("image/png");
            } catch (err) {
                logoData = "";
            }
            resolve(logoData);
        };
        img.onerror = function () {
            resolve("");
        };
        img.src = BUSINESS.logo;
    });
}

function ensureSpace(doc, y, need) {
    if (y + need < 272) return y;
    doc.addPage();
    return 18;
}

function buildPdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error("PDF library did not load. Check your internet connection.");
    }
    const t = totals();
    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
    const navy = [3, 5, 83];
    const cyan = [0, 185, 253];
    const muted = [91, 100, 120];
    const pageW = 210;
    const margin = 16;
    let y = 16;

    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(0, 0, pageW, 38, "F");
    doc.setFillColor(cyan[0], cyan[1], cyan[2]);
    doc.rect(0, 38, pageW, 2.2, "F");

    if (logoData) {
        try {
            doc.addImage(logoData, "PNG", margin, 8, 18, 18);
        } catch (err) {}
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(BUSINESS.name, logoData ? margin + 22 : margin, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(contactLines().join("  ·  "), logoData ? margin + 22 : margin, 23);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INVOICE", pageW - margin, 18, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(val("invoice-number") || "—", pageW - margin, 25, { align: "right" });
    doc.text(currencyCode(), pageW - margin, 31, { align: "right" });

    y = 50;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(0, 192, 186);
    doc.text("BILL TO", margin, y);
    doc.text("INVOICE DETAILS", 120, y);
    y += 6;
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let bill = [val("customer-name"), val("company-name"), val("customer-phone"), val("customer-email"), val("customer-address")].filter(Boolean);
    if (!bill.length) bill = ["—"];
    const billLines = doc.splitTextToSize(bill.join("\n"), 90);
    doc.text(billLines, margin, y);
    doc.text("Date: " + formatDate(val("invoice-date")), 120, y);
    doc.text("Due: " + formatDate(val("due-date")), 120, y + 6);
    y = Math.max(y + billLines.length * 5, y + 16) + 8;

    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(margin, y, pageW - margin * 2, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("DESCRIPTION", margin + 2, y + 5.5);
    doc.text("QTY", 128, y + 5.5, { align: "right" });
    doc.text("UNIT PRICE", 158, y + 5.5, { align: "right" });
    doc.text("AMOUNT", pageW - margin - 2, y + 5.5, { align: "right" });
    y += 10;

    let visible = t.items.filter(function (item) {
        return item.desc || item.qty || item.price;
    });
    if (!visible.length) visible = [{ desc: "No items", qty: 0, price: 0, total: 0 }];

    doc.setFont("helvetica", "normal");
    doc.setTextColor(navy[0], navy[1], navy[2]);
    visible.forEach(function (item, i) {
        const descLines = doc.splitTextToSize(item.desc || "—", 100);
        const rowH = Math.max(8, descLines.length * 4.5 + 3);
        y = ensureSpace(doc, y, rowH);
        if (i % 2 === 0) {
            doc.setFillColor(244, 248, 251);
            doc.rect(margin, y - 4, pageW - margin * 2, rowH, "F");
        }
        doc.setFontSize(9);
        doc.text(descLines, margin + 2, y);
        doc.text(String(item.qty), 128, y, { align: "right" });
        doc.text(money(item.price), 158, y, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.text(money(item.total), pageW - margin - 2, y, { align: "right" });
        doc.setFont("helvetica", "normal");
        y += rowH;
    });

    y = ensureSpace(doc, y + 6, 40);
    const boxX = 118;
    doc.setFontSize(9);
    doc.setTextColor(muted[0], muted[1], muted[2]);
    function totalRow(label, value) {
        doc.setFont("helvetica", "normal");
        doc.text(label, boxX, y);
        doc.text(value, pageW - margin, y, { align: "right" });
        y += 6;
    }
    totalRow("Subtotal", money(t.subtotal));
    totalRow("Discount", money(t.discount));
    totalRow("Tax / VAT (" + t.taxRate + "%)", money(t.tax));
    y += 1;
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.roundedRect(boxX - 4, y - 5, pageW - margin - (boxX - 4), 11, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Grand total", boxX, y + 2);
    doc.text(money(t.grand), pageW - margin, y + 2, { align: "right" });
    y += 16;

    function writeSection(title, text) {
        if (!text) return;
        const lines = doc.splitTextToSize(text, pageW - margin * 2);
        y = ensureSpace(doc, y, 10 + lines.length * 4.5);
        doc.setTextColor(navy[0], navy[1], navy[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(title, margin, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(muted[0], muted[1], muted[2]);
        doc.text(lines, margin, y);
        y += lines.length * 4.5 + 4;
    }

    writeSection("PAYMENT INFORMATION", val("payment"));
    writeSection("NOTES", val("notes"));
    writeSection("TERMS AND CONDITIONS", val("terms"));

    doc.setFillColor(cyan[0], cyan[1], cyan[2]);
    doc.rect(0, 287, pageW, 10, "F");
    doc.setTextColor(3, 5, 83);
    doc.setFontSize(8);
    doc.text("Thank you for your business  ·  " + BUSINESS.name, pageW / 2, 293, { align: "center" });
    return doc;
}

function generatePdfDoc() {
    return loadLogo().then(buildPdf);
}

function startGenerator() {
    document.getElementById("payment").value = BUSINESS.payment || "";
    document.getElementById("terms").value = BUSINESS.terms || "";
    document.getElementById("invoice-number").value = nextInvoiceNumber();
    document.getElementById("invoice-date").value = todayISO();
    document.getElementById("due-date").value = addDaysISO(14);
    addRow();
    renderPreview();

    document.getElementById("add-item").addEventListener("click", function () {
        addRow();
        renderPreview();
    });

    body.addEventListener("click", function (event) {
        const btn = event.target.closest(".item-remove");
        if (!btn) return;
        if (body.querySelectorAll("tr").length === 1) {
            btn.closest("tr").querySelector(".item-desc").value = "";
            btn.closest("tr").querySelector(".item-qty").value = "1";
            btn.closest("tr").querySelector(".item-price").value = "";
        } else {
            btn.closest("tr").remove();
        }
        renderPreview();
    });

    document.getElementById("invoice-form").addEventListener("input", renderPreview);
    document.getElementById("currency").addEventListener("change", renderPreview);

    document.getElementById("btn-pdf").addEventListener("click", function () {
        setStatus("Creating PDF…");
        generatePdfDoc()
            .then(function (doc) {
                doc.save(fileName());
                bumpInvoiceNumber();
                setStatus("PDF downloaded as " + fileName() + ".", "ok");
            })
            .catch(function (err) {
                setStatus(err.message || "Could not create the PDF.", "err");
            });
    });

    document.getElementById("btn-print").addEventListener("click", function () {
        window.print();
    });

    document.getElementById("btn-email").addEventListener("click", function () {
        const t = totals();
        const number = val("invoice-number") || "invoice";
        const customer = val("customer-name") || "the customer";
        const subject = "Invoice " + number + " — " + BUSINESS.name;
        const bodyText =
            "Please find invoice " +
            number +
            " for " +
            customer +
            ".\n\nGrand total: " +
            money(t.grand) +
            "\n\nDownload the PDF first, then attach it to your email.\nA browser cannot attach the PDF file automatically.\n\n" +
            BUSINESS.name +
            "\n" +
            BUSINESS.phone +
            "\n" +
            BUSINESS.email;
        window.location.href =
            "mailto:" +
            encodeURIComponent(BUSINESS.email) +
            "?subject=" +
            encodeURIComponent(subject) +
            "&body=" +
            encodeURIComponent(bodyText);
        setStatus("Download the PDF first, then attach it to your email.", "ok");
    });

    document.getElementById("btn-signout").addEventListener("click", firebaseSignOut);
}

googleBtn.addEventListener("click", signInGoogle);
document.getElementById("btn-retry").addEventListener("click", function () {
    denyLock = false;
    setAuthMessage("");
    showGate();
});

bootAuth();
