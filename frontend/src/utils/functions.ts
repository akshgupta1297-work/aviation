import { Bounce, toast } from "react-toastify";
import { flightTax } from "./jsonArry";

export const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', weekday: 'short' };
    return d.toLocaleDateString('en-GB', options);
};

export const calculateDuration = (start: string, end: string) => {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
};

export const calculateFare = (flightInstances: any[], passengerNo: number[]) => {
    const [adults, children, infants] = passengerNo;
    const adultChildCount = adults + children;

    const totalPrice = flightInstances.length > 1 ? flightInstances.reduce((acc, leg) => acc + (leg.baseFare || 5000), 0) : flightInstances.reduce((acc, leg) => acc + (leg.baseFare || 5000), 0);
    const totalPriceWithTaxes = totalPrice + flightTax.reduce((acc, tax) => acc + (tax.type === "gst" ? totalPrice * tax.value * 2 : tax.value), 0);
    const taxes = totalPriceWithTaxes - totalPrice
    const adultChildFare =
        Math.ceil(adultChildCount * totalPrice);

    // Infants pay half fare
    const infantFare =
        Math.ceil(infants * (totalPrice * 0.5));

    // Taxes only for adults & children
    const totalTaxes =
        Math.ceil(adultChildCount * taxes);

    const totalAmount =
        Math.ceil(adultChildFare +
            infantFare +
            totalTaxes);
    return { totalPriceWithTaxes, totalPrice, totalTaxes, adultChildFare, infantFare, totalAmount: Math.ceil(totalAmount) };
}

export const sendToster = ({ type, message }: { type: "success" | "error" | "warning" | "info", message: string }) => {
    type === "success" && toast.success(message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
    type === "error" && toast.error(message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
    type === "warning" && toast.warning(message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
    type === "info" && toast.info(message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });

}

export const debounce = (func: Function, delay: number) => {
    let timeoutId: any;
    return function (...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}