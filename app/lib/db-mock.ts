import {revenue, users, customers, invoices} from "@/app/lib/placeholder-data";
import {CustomersTableType, Invoice, InvoicesTable, LatestInvoice} from "@/app/lib/definitions";
import { formatCurrency } from './utils';


const ITEMS_PER_PAGE = 6

async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export async function fetchRevenue() {
    return revenue
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
    const latestInvoices: LatestInvoice[] = [];

    invoices.forEach((invoice) => {

        const relatedCustomer = customers.find(c => c.id == invoice.customer_id);

        const latestInvoice: LatestInvoice = {
            id: invoice.id,
            amount: invoice.amount.toString(),
            image_url: relatedCustomer?.image_url ?? "",
            email: relatedCustomer?.email ?? "",
            name: relatedCustomer?.name ?? ""
        }

        latestInvoices.push(latestInvoice)
    })

    return latestInvoices.slice(0, 5);
}

export async function fetchCardData() {
    const numberOfInvoices = invoices.length;
    const numberOfCustomers = customers.length;
    let totalPaidInvoicesAmount = 0;
    let totalPendingInvoicesAmount = 0;

    invoices.filter(t => t.status == 'paid').forEach(t => totalPaidInvoicesAmount += t.amount);
    invoices.filter(t => t.status == 'pending').forEach(t => totalPendingInvoicesAmount += t.amount);

    const totalPaidInvoices: string = formatCurrency(totalPaidInvoicesAmount);
    const totalPendingInvoices: string = formatCurrency(totalPendingInvoicesAmount);


    return {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
    }
}

export async function fetchFilteredInvoices(
    query: string,
    currentPage: number,
): Promise<InvoicesTable[]> {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const latestInvoices: InvoicesTable[] = [];

    invoices.forEach((invoice) => {

        const relatedCustomer = customers.find(c => c.id == invoice.customer_id);

        const latestInvoice: InvoicesTable = {
            id: invoice.id,
            customer_id: relatedCustomer?.id ?? "",
            name: relatedCustomer?.name ?? "",
            email: relatedCustomer?.email ?? "",
            image_url: relatedCustomer?.image_url ?? "",
            date: invoice.date,
            amount: invoice.amount,
            status: invoice.status,
        }

        latestInvoices.push(latestInvoice)
    })

    return latestInvoices.filter(t => t.name.includes(query)).slice(offset, offset + ITEMS_PER_PAGE);
}

export async function fetchInvoicesPages() {
    const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
    return totalPages
}

export async function fetchInvoiceById(
    id: string,
) {
    return invoices.map(t => t.id == id);
}

export async function fetchCustomers() {
    return customers
}

export async function fetchFilteredCustomers() {
    const customersTable: CustomersTableType[] = [];

    customers.forEach(c => {
        const invoicesOfCustomer = invoices.filter(i => i.customer_id == c.id);

        let total_pending = 0
        let total_paid = 0
        invoicesOfCustomer.forEach(i => {
            if (i.status == 'pending') { total_pending += i.amount }
            if (i.status == 'paid') { total_paid += i.amount }
        })

        customersTable.push({
            id: c.id,
            name: c.name,
            email: c.email,
            image_url: c.image_url,
            total_invoices: invoicesOfCustomer.length,
            total_pending: total_pending,
            total_paid: total_paid
        })
    });
}