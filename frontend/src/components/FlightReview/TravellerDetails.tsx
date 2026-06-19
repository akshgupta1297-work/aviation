"use client";
import React, { useEffect } from 'react';
import { FaExclamation } from 'react-icons/fa6';
import { Switch } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export type Traveller = {
    title: string;
    firstName: string;
    lastName: string;
    dob?: { day: string; month: string; year: string };
};

interface TravellerDetailsProps {
    passengers: number[];
    travellers: {
        adults: Traveller[];
        children: Traveller[];
        infants: Traveller[];
        contact: { number: string; email: string };
        gst: { isGst: boolean; gstNo: string; companyName: string };
    };
    setTravellers: (travellers: any) => void;
    onContinue: () => void;
}

const phoneRegex = /^[6-9]\d{9}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const schema = yup.object().shape({
    adults: yup.array().of(
        yup.object().shape({
            title: yup.string().required("Required"),
            firstName: yup.string().required("Required"),
            lastName: yup.string().required("Required"),
        })
    ).required(),
    children: yup.array().of(
        yup.object().shape({
            title: yup.string().required("Required"),
            firstName: yup.string().required("Required"),
            lastName: yup.string().required("Required"),
            dob: yup.object().shape({
                day: yup.string().required("Required"),
                month: yup.string().required("Required"),
                year: yup.string().required("Required"),
            }).required(),
        })
    ).required(),
    infants: yup.array().of(
        yup.object().shape({
            title: yup.string().required("Required"),
            firstName: yup.string().required("Required"),
            lastName: yup.string().required("Required"),
            dob: yup.object().shape({
                day: yup.string().required("Required"),
                month: yup.string().required("Required"),
                year: yup.string().required("Required"),
            }).required(),
        })
    ).required(),
    contact: yup.object().shape({
        number: yup.string().matches(phoneRegex, "Invalid phone number (10 digits)").required("Required"),
        email: yup.string().email("Invalid email").required("Required"),
    }).required(),
    gst: yup.object().shape({
        isGst: yup.boolean().required(),
        gstNo: yup.string().when("isGst", {
            is: true,
            then: (schema) => schema.matches(gstRegex, "Invalid GST format").required("Required"),
            otherwise: (schema) => schema.optional(),
        }),
        companyName: yup.string().when("isGst", {
            is: true,
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.optional(),
        }),
    }).required(),
});

const TravellerDetails: React.FC<TravellerDetailsProps> = ({ passengers, travellers, setTravellers, onContinue }) => {
    const [numAdults, numChildren, numInfants] = passengers;

    // Generate default array lengths
    const defaultAdults = Array.from({ length: numAdults }, (_, i) => travellers.adults[i] || { title: "", firstName: "", lastName: "" });
    const defaultChildren = Array.from({ length: numChildren }, (_, i) => travellers.children[i] || { title: "", firstName: "", lastName: "", dob: { day: "", month: "", year: "" } });
    const defaultInfants = Array.from({ length: numInfants }, (_, i) => travellers.infants[i] || { title: "", firstName: "", lastName: "", dob: { day: "", month: "", year: "" } });

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            adults: defaultAdults,
            children: defaultChildren as any,
            infants: defaultInfants as any,
            contact: travellers.contact,
            gst: travellers.gst,
        },
        mode: "onTouched",
    });

    const isGstEnabled = watch("gst.isGst");

    const onSubmit = (data: any) => {
        setTravellers(data);
        onContinue();
    };

    // Options for DOB
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

    // Helper for rendering input class based on error
    const inputClass = (error: any) => `border ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 text-gray-700 outline-none focus:border-blue-500 text-sm w-full`;
    const selectClass = (error: any) => `border ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 text-gray-700 bg-white outline-none focus:border-blue-500 text-sm w-full`;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className='flex items-start md:items-center gap-3 bg-amber-50 text-amber-900 p-3 rounded-lg text-sm mb-6 border border-amber-100'>
                <FaExclamation className='bg-amber-500 text-white rounded-full p-1 shrink-0 mt-0.5 md:mt-0' size={20} />
                <span>Traveller name must match with the Government ID that is presented by you at the airport.</span>
            </div>

            <div className="space-y-8">
                {/* Adults */}
                {defaultAdults.map((_, index) => (
                    <div key={`adult-${index}`} className="flex flex-col gap-3">
                        <div>
                            <h2 className="font-semibold text-gray-800 text-base">Adult {index + 1}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-4">
                            <div>
                                <select {...register(`adults.${index}.title` as const)} className={selectClass(errors.adults?.[index]?.title)}>
                                    <option value="" disabled>Title</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Mrs">Mrs</option>
                                </select>
                                {errors.adults?.[index]?.title && <p className="text-red-500 text-xs mt-1">{errors.adults[index]?.title?.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="First Name and Middle Name"
                                    {...register(`adults.${index}.firstName` as const)}
                                    className={inputClass(errors.adults?.[index]?.firstName)}
                                />
                                {errors.adults?.[index]?.firstName && <p className="text-red-500 text-xs mt-1">{errors.adults[index]?.firstName?.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    {...register(`adults.${index}.lastName` as const)}
                                    className={inputClass(errors.adults?.[index]?.lastName)}
                                />
                                {errors.adults?.[index]?.lastName && <p className="text-red-500 text-xs mt-1">{errors.adults[index]?.lastName?.message}</p>}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Children */}
                {defaultChildren.map((_, index) => (
                    <div key={`child-${index}`} className="flex flex-col gap-3">
                        <div>
                            <h2 className="font-semibold text-gray-800 text-base">Child {index + 1}</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Age must be between 2-12 years at the time of travel</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-4">
                            <div>
                                <select {...register(`children.${index}.title` as const)} className={selectClass(errors.children?.[index]?.title)}>
                                    <option value="" disabled>Title</option>
                                    <option value="Mstr">Mstr</option>
                                    <option value="Miss">Miss</option>
                                </select>
                                {errors.children?.[index]?.title && <p className="text-red-500 text-xs mt-1">{errors.children[index]?.title?.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="First Name and Middle Name"
                                    {...register(`children.${index}.firstName` as const)}
                                    className={inputClass(errors.children?.[index]?.firstName)}
                                />
                                {errors.children?.[index]?.firstName && <p className="text-red-500 text-xs mt-1">{errors.children[index]?.firstName?.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    {...register(`children.${index}.lastName` as const)}
                                    className={inputClass(errors.children?.[index]?.lastName)}
                                />
                                {errors.children?.[index]?.lastName && <p className="text-red-500 text-xs mt-1">{errors.children[index]?.lastName?.message}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-1">
                            <label className="text-xs font-semibold text-gray-700">Date of Birth</label>
                            <div className="flex gap-3">
                                <div className="flex flex-col w-20">
                                    <select {...register(`children.${index}.dob.day` as const)} className={selectClass(errors.children?.[index]?.dob?.day)}>
                                        <option value="" disabled>DD</option>
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col w-20">
                                    <select {...register(`children.${index}.dob.month` as const)} className={selectClass(errors.children?.[index]?.dob?.month)}>
                                        <option value="" disabled>MM</option>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col w-24">
                                    <select {...register(`children.${index}.dob.year` as const)} className={selectClass(errors.children?.[index]?.dob?.year)}>
                                        <option value="" disabled>YY</option>
                                        {years.slice(0, 15).map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            {(errors.children?.[index]?.dob?.day || errors.children?.[index]?.dob?.month || errors.children?.[index]?.dob?.year) && (
                                <p className="text-red-500 text-xs mt-0.5">Please select a complete Date of Birth</p>
                            )}
                        </div>
                    </div>
                ))}

                {/* Infants */}
                {defaultInfants.map((_, index) => (
                    <div key={`infant-${index}`} className="flex flex-col gap-3">
                        <div>
                            <h2 className="font-semibold text-gray-800 text-base">Infant {index + 1}</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Age must be below 2 years at the time of travel</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-4">
                            <div>
                                <select {...register(`infants.${index}.title` as const)} className={selectClass(errors.infants?.[index]?.title)}>
                                    <option value="" disabled>Title</option>
                                    <option value="Mstr">Mstr</option>
                                    <option value="Miss">Miss</option>
                                </select>
                                {errors.infants?.[index]?.title && <p className="text-red-500 text-xs mt-1">{errors.infants[index]?.title?.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="First Name and Middle Name"
                                    {...register(`infants.${index}.firstName` as const)}
                                    className={inputClass(errors.infants?.[index]?.firstName)}
                                />
                                {errors.infants?.[index]?.firstName && <p className="text-red-500 text-xs mt-1">{errors.infants[index]?.firstName?.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    {...register(`infants.${index}.lastName` as const)}
                                    className={inputClass(errors.infants?.[index]?.lastName)}
                                />
                                {errors.infants?.[index]?.lastName && <p className="text-red-500 text-xs mt-1">{errors.infants[index]?.lastName?.message}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-1">
                            <label className="text-xs font-semibold text-gray-700">Date of Birth</label>
                            <div className="flex gap-3">
                                <div className="flex flex-col w-20">
                                    <select {...register(`infants.${index}.dob.day` as const)} className={selectClass(errors.infants?.[index]?.dob?.day)}>
                                        <option value="" disabled>DD</option>
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col w-20">
                                    <select {...register(`infants.${index}.dob.month` as const)} className={selectClass(errors.infants?.[index]?.dob?.month)}>
                                        <option value="" disabled>MM</option>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col w-24">
                                    <select {...register(`infants.${index}.dob.year` as const)} className={selectClass(errors.infants?.[index]?.dob?.year)}>
                                        <option value="" disabled>YY</option>
                                        {years.slice(0, 3).map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            {(errors.infants?.[index]?.dob?.day || errors.infants?.[index]?.dob?.month || errors.infants?.[index]?.dob?.year) && (
                                <p className="text-red-500 text-xs mt-0.5">Please select a complete Date of Birth</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Contact Information */}
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="font-semibold text-gray-800 text-lg">Contact Information</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Your booking details will be sent here</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    <div className="w-full">
                        <input
                            type="tel"
                            placeholder="Phone Number (10 digits)"
                            {...register("contact.number")}
                            className={inputClass(errors.contact?.number)}
                        />
                        {errors.contact?.number && <p className="text-red-500 text-xs mt-1">{errors.contact.number.message}</p>}
                    </div>
                    <div className="w-full">
                        <input
                            type="email"
                            placeholder="Email Address"
                            {...register("contact.email")}
                            className={inputClass(errors.contact?.email)}
                        />
                        {errors.contact?.email && <p className="text-red-500 text-xs mt-1">{errors.contact.email.message}</p>}
                    </div>
                </div>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* GST Details */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start md:items-center">
                    <div>
                        <h2 className="font-semibold text-gray-800 text-lg">GST Details <span className="text-gray-400 font-normal text-sm">(Optional)</span></h2>
                        <p className="text-xs text-gray-500 mt-0.5">Claim benefits by adding company GST details</p>
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="gst.isGst"
                            render={({ field: { onChange, value } }) => (
                                <Switch
                                    isSelected={value}
                                    onChange={(e) => onChange(e)}
                                    size="lg"
                                >
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch>
                            )}
                        />
                    </div>
                </div>

                {isGstEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mt-2">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="GSTN no. (e.g. 22AAAAA0000A1Z5)"
                                {...register("gst.gstNo")}
                                className={inputClass(errors.gst?.gstNo) + " uppercase"}
                            />
                            {errors.gst?.gstNo && <p className="text-red-500 text-xs mt-1">{errors.gst.gstNo.message}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Company Name"
                                {...register("gst.companyName")}
                                className={inputClass(errors.gst?.companyName)}
                            />
                            {errors.gst?.companyName && <p className="text-red-500 text-xs mt-1">{errors.gst.companyName.message}</p>}
                        </div>
                    </div>
                )}
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Footer */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                    By clicking Continue, I confirm all the details entered are correct and acknowledge that details will be shared with our booking partner to process the booking
                </p>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow transition-colors"
                >
                    Continue →
                </button>
            </div>
        </form>
    );
};

export default TravellerDetails;