import { faCaretDown, faL, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

export default function AddressSection() {
    const navigate = useNavigate();
    const { addresses } = useLoaderData();
    const [showAddressEditor, setShowAddressEditor] = useState(false);

    return (
        <div className="bg-citrus-peach-light w-full h-full py-5 px-6 rounded-lg flex flex-col gap-4">
            {
                showAddressEditor && (
                    <AddressEditor onClose={() => setShowAddressEditor(false)} onComplete={() => {
                        setShowAddressEditor(false)
                        navigate("/me/address", { replace: true })
                    }}/>
                )
            }
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-start md:items-center gap-4">
                <h1 className="text-xl text-citrus-rose font-bold">My Addresses</h1>
                <div className="flex flex-row gap-2 items-center bg-citrus-rose px-3 py-1.5 rounded-lg text-lg text-citrus-peach-light font-bold cursor-pointer" onClick={() => setShowAddressEditor(true)}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Add New Address</p>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                { addresses.map((address, i) => (
                    <Address key={i} index={i} address={address} />
                )) }
            </div>
        </div>
    )
}

function Address({ index, address }) {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-slate-100 shadow-lg p-5 rounded-lg flex flex-col md:flex-row gap-2 justify-between items-center">
            <div>
                <h1 className="text-lg text-citrus-rose font-bold">Address {index + 1}</h1>
                <p className="text-md text-slate-500 font-semibold">{address.address}, {address.barangay}, {address.city}, {address.province ? `${address.province}, ${address.region}` : address.region}</p>
            </div>
            <div>
                <button className="bg-citrus-rose px-2 py-1 rounded-lg text-md text-citrus-peach-light font-semibold cursor-pointer" onClick={async() => {
                    const response = (await axios.post(`${import.meta.env.VITE_API_URL}/address/delete`, { id: address.id }, { withCredentials: true })).data;
                    if(response.status == 200) navigate("/me/address", { replace: true })
                }}>Delete</button>
            </div>
        </div>
    )
}

function AddressEditor({ onClose = () => {}, onComplete = () => {} }) {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [regionsDropdown, setRegionsDropdown] = useState(false);
    const [provincesDropdown, setProvincesDropdown] = useState(false);
    const [citiesDropdown, setCitiesDropdown] = useState(false);
    const [barangaysDropdown, setBarangaysDropdown] = useState(false);

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [address, setAddress] = useState("");

    const isValid =  selectedRegion && (provinces.length > 0 ? selectedProvince : true) && selectedCity && selectedBarangay && address;

    useEffect(() => {
        async function fetchRegions() {
            const response = (await axios.get("https://psgc.gitlab.io/api/regions/"));
            const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setRegions(sorted);
        }
        fetchRegions()
    }, [])

    useEffect(() => {
        if(!selectedRegion) return;
        async function fetchProvinces() {
            const region = regions[selectedRegion];
            const response = (await axios.get(`https://psgc.gitlab.io/api/regions/${region.code}/provinces/`));
            const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setProvinces(sorted);
        }
        fetchProvinces()
    }, [selectedRegion])

    useEffect(() => {
        if(!selectedRegion) return;
        async function fetchCities() {
            if(selectedProvince && provinces.length > 0) {
                const province = provinces[selectedProvince];
                const response = (await axios.get(`https://psgc.gitlab.io/api/provinces/${province.code}/cities-municipalities/`));
                const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setCities(sorted);
            } else {
                const region = regions[selectedRegion];
                const response = (await axios.get(`https://psgc.gitlab.io/api/regions/${region.code}/cities-municipalities/`));
                const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setCities(sorted);
            }
        }
        fetchCities()
    }, [selectedRegion, selectedProvince])

    useEffect(() => {
        if(!selectedCity) return;
        async function fetchBarangay() {
            const city = cities[selectedCity];
            const response = (await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${city.code}/barangays/`));
            const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setBarangays(sorted);
        }
        fetchBarangay()
    }, [selectedCity])

    return (
        <div className="fixed w-full h-full bg-black/25 top-0 bottom-0 left-0 right-0 z-60 flex justify-center items-center">
            <div className="bg-slate-200 w-80 p-5 rounded-lg shadow-lg flex flex-col gap-3">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-lg text-citrus-rose font-bold">Creating New Address</h1>
                    <button className="bg-slate-400/50 px-1.5 py-1 rounded-full text-citrus-rose cursor-pointer transition-all duration-200 hover:bg-citrus-rose hover:text-citrus-peach-light" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-citrus-orange">Region</label>
                    <div className="relative">
                        <div className="bg-citrus-peach-light/50 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center cursor-pointer" onClick={
                            () => {
                                setRegionsDropdown((prev) => !prev)
                                setProvincesDropdown(false)
                                setCitiesDropdown(false)
                                setBarangaysDropdown(false)
                            }
                        }>
                            <p className="text-md text-citrus-pink font-semibold">{
                                selectedRegion ? regions[selectedRegion].name : "Select Region"
                            }</p>
                            <FontAwesomeIcon className={`text-citrus-pink ${regionsDropdown ? "rotate-180" : ""} transition-all duration-200`} icon={faCaretDown}/>
                        </div>
                        <div className={`absolute w-full h-33 bg-citrus-peach-light px-3 py-1.5 z-10 ${regionsDropdown ? "top-10 opacity-100 pointer-events-auto" : "top-5 opacity-0 pointer-events-none"} left-0 right-0 rounded-lg shadow-lg overflow-y-scroll no-scrollbar transition-all duration-200`}>
                            { regions.map((region, i) => (
                                <div key={region.code} className="text-md text-citrus-pink font-semibold cursor-pointer" onClick={() => {
                                    setSelectedRegion(i.toString());
                                    setSelectedProvince("");
                                    setSelectedCity("");
                                    setSelectedBarangay("");
                                    setRegionsDropdown(false);
                                }}>{region.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
                {
                    (provinces.length > 0 && selectedRegion) && (
                        <div>
                            <label className="block text-sm font-semibold text-citrus-orange">Province</label>
                            <div className="relative">
                                <div className="bg-citrus-peach-light/50 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center cursor-pointer" onClick={
                                    () => {
                                        setRegionsDropdown(false)
                                        setProvincesDropdown((prev) => !prev)
                                        setCitiesDropdown(false)
                                        setBarangaysDropdown(false)
                                    }
                                }>
                                    <p className="text-md text-citrus-pink font-semibold">{
                                        selectedProvince ? provinces[selectedProvince].name : "Select Province"
                                    }</p>
                                    <FontAwesomeIcon className={`text-citrus-pink ${provincesDropdown ? "rotate-180" : ""} transition-all duration-200`} icon={faCaretDown}/>
                                </div>
                                <div className={`absolute w-full h-33 bg-citrus-peach-light px-3 py-1.5 z-10 ${provincesDropdown ? "top-10 opacity-100 pointer-events-auto" : "top-5 opacity-0 pointer-events-none"} left-0 right-0 rounded-lg shadow-lg overflow-y-scroll no-scrollbar transition-all duration-200`}>
                                    { provinces.map((province, i) => (
                                        <div key={province.code} className="text-md text-citrus-pink font-semibold cursor-pointer" onClick={() => {
                                            setSelectedProvince(i.toString())
                                            setSelectedCity("")
                                            setSelectedBarangay("")
                                            setProvincesDropdown(false)
                                        }}>{province.name}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    ((provinces.length === 0 && selectedRegion) || (provinces.length > 0 && selectedProvince)) && (
                        <div>
                            <label className="block text-sm font-semibold text-citrus-orange">City</label>
                            <div className="relative">
                                <div className="bg-citrus-peach-light/50 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center cursor-pointer" onClick={
                                    () => {
                                        setRegionsDropdown(false)
                                        setProvincesDropdown(false)
                                        setCitiesDropdown((prev) => !prev)
                                        setBarangaysDropdown(false)
                                    }
                                }>
                                    <p className="text-md text-citrus-pink font-semibold">{
                                        selectedCity ? cities[selectedCity].name : "Select City"
                                    }</p>
                                    <FontAwesomeIcon className={`text-citrus-pink ${citiesDropdown ? "rotate-180" : ""} transition-all duration-200`} icon={faCaretDown}/>
                                </div>
                                <div className={`absolute w-full h-33 bg-citrus-peach-light px-3 py-1.5 z-10 ${citiesDropdown ? "top-10 opacity-100 pointer-events-auto" : "top-5 opacity-0 pointer-events-none"} left-0 right-0 rounded-lg shadow-lg overflow-y-scroll no-scrollbar transition-all duration-200`}>
                                    { cities.map((city, i) => (
                                        <div key={city.code} className="text-md text-citrus-pink font-semibold cursor-pointer" onClick={() => {
                                            setSelectedCity(i.toString())
                                            setSelectedBarangay("")
                                            setCitiesDropdown(false)
                                        }}>{city.name}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    selectedCity && (
                        <div>
                            <label className="block text-sm font-semibold text-citrus-orange">Barangay</label>
                            <div className="relative">
                                <div className="bg-citrus-peach-light/50 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center cursor-pointer" onClick={
                                    () => {
                                        setRegionsDropdown(false)
                                        setProvincesDropdown(false)
                                        setCitiesDropdown(false)
                                        setBarangaysDropdown((prev) => !prev)
                                    }
                                }>
                                    <p className="text-md text-citrus-pink font-semibold">{
                                        selectedBarangay ? barangays[selectedBarangay].name : "Select Barangay"
                                    }</p>
                                    <FontAwesomeIcon className={`text-citrus-pink ${barangaysDropdown ? "rotate-180" : ""} transition-all duration-200`} icon={faCaretDown}/>
                                </div>
                                <div className={`absolute w-full h-33 bg-citrus-peach-light px-3 py-1.5 z-10 ${barangaysDropdown ? "top-10 opacity-100 pointer-events-auto" : "top-5 opacity-0 pointer-events-none"} left-0 right-0 rounded-lg shadow-lg overflow-y-scroll no-scrollbar transition-all duration-200`}>
                                    { barangays.map((barangay, i) => (
                                        <div key={barangay.code} className="text-md text-citrus-pink font-semibold cursor-pointer" onClick={() => {
                                            setSelectedBarangay(i.toString())
                                            setBarangaysDropdown(false)
                                        }}>{barangay.name}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    selectedBarangay && (
                        <div>
                            <label className="block text-sm font-semibold text-citrus-orange">Street / Building / House No.</label>
                            <input className="bg-citrus-peach-light/50 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="text" onChange={(e) => {
                                setAddress(e.target.value)
                            }} placeholder="Street / Building / House No."/>
                        </div>
                    )
                }
                <button className={`${isValid ? "bg-citrus-rose cursor-pointer transition-all duration-500 hover:text-rose-300 hover:scale-105 hover:shadow-lg" : "bg-citrus-rose/50"} w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`}
                    onClick={async() => {
                        if(isValid) {
                            const response = (await axios.post(`${import.meta.env.VITE_API_URL}/address/add`, {
                                region: regions[selectedRegion].name,
                                province: provinces.length > 0 ? provinces[selectedProvince].name : "",
                                city: cities[selectedCity].name,
                                barangay: barangays[selectedBarangay].name,
                                address: address
                            }, { withCredentials: true })).data;

                            if(response.status == 200) onComplete();
                        }
                    }}
                >
                    Add Address
                </button>
            </div>
        </div>
    )
}