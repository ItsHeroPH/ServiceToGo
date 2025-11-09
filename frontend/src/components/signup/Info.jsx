import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Info({ onNext = ({}) => {} }) {
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [regionsDropdown, setRegionsDropdown] = useState(false);
    const [citiesDropdown, setCitiesDropdown] = useState(false);
    const [barangaysDropdown, setBarangaysDropdown] = useState(false);

    const [name, setName] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [address, setAddress] = useState("");

    const isValid = name && selectedRegion && selectedCity && selectedBarangay && address;

    useEffect(() => {
        async function fetchProvinces() {
            const response = (await axios.get("https://psgc.gitlab.io/api/regions/"));
            const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setRegions(sorted);
        }
        fetchProvinces()
    }, [])

    useEffect(() => {
        if(!selectedRegion) return;
        async function fetchCities() {
            const region = regions[selectedRegion];
            const response = (await axios.get(`https://psgc.gitlab.io/api/regions/${region.code}/cities-municipalities/`));
            const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setCities(sorted);
        }
        fetchCities()
    }, [selectedRegion])

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
        <div className="flex flex-col gap-3">
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Name</label>
                <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="text" onChange={(e) => {
                    setName(e.target.value)
                }} placeholder="Your Name"/>
            </div>
            <h1 className="text-md text-citrus-rose font-bold">Address</h1>
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Region</label>
                <div className="relative">
                    <div className="bg-slate-200 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center cursor-pointer" onClick={
                        () => {
                            setRegionsDropdown((prev) => !prev)
                            setCitiesDropdown(false)
                            setBarangaysDropdown(false)
                        }
                    }>
                        <p className="text-md text-citrus-pink font-semibold">{
                            selectedRegion ? regions[selectedRegion].name : "Select Province"
                        }</p>
                        <FontAwesomeIcon className={`text-citrus-pink ${regionsDropdown ? "rotate-180" : ""} transition-all duration-200`} icon={faCaretDown}/>
                    </div>
                    <div className={`absolute w-full h-33 bg-slate-200 px-3 py-1.5 z-10 ${regionsDropdown ? "top-10 opacity-100 pointer-events-auto" : "top-5 opacity-0 pointer-events-none"} left-0 right-0 rounded-lg shadow-lg overflow-y-scroll no-scrollbar transition-all duration-200`}>
                        { regions.map((region, i) => (
                            <div key={region.code} className="text-md text-citrus-pink font-semibold cursor-pointer" onClick={() => {
                                setSelectedRegion(i.toString())
                                setSelectedCity("")
                                setSelectedBarangay("")
                                setRegionsDropdown(false)
                            }}>{region.name}</div>
                        ))}
                    </div>
                </div>
            </div>
            { selectedRegion ? (
                <div>
                    <label className="block text-sm font-semibold text-citrus-orange">City</label>
                    <div className="relative">
                        <div className="bg-slate-200 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center cursor-pointer" onClick={
                            () => {
                                setRegionsDropdown(false)
                                setCitiesDropdown((prev) => !prev)
                                setBarangaysDropdown(false)
                            }
                        }>
                            <p className="text-md text-citrus-pink font-semibold">{
                                selectedCity ? cities[selectedCity].name : "Select City"
                            }</p>
                            <FontAwesomeIcon className={`text-citrus-pink ${citiesDropdown ? "rotate-180" : ""} transition-all duration-200`}  icon={faCaretDown}/>
                        </div>
                        <div className={`absolute w-full h-33 bg-slate-200 px-3 py-1.5 z-10 ${citiesDropdown ? "top-10 opacity-100 pointer-events-auto" : "top-5 opacity-0 pointer-events-none"} left-0 right-0 rounded-lg shadow-lg overflow-y-scroll no-scrollbar transition-all duration-200`}>
                            { cities.map((city, i) => (
                                <div key={city.code} className="text-md text-citrus-pink font-semibold cursor-pointer" onClick={() => {
                                    setSelectedCity(i.toString())
                                    setCitiesDropdown(false)
                                }}>{city.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (<></>) }
            { selectedCity ? (
                <div>
                    <label className="block text-sm font-semibold text-citrus-orange">Barangay</label>
                    <div className="relative">
                        <div className="bg-slate-200 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center cursor-pointer" onClick={
                            () => {
                                setRegionsDropdown(false)
                                setCitiesDropdown(false)
                                setBarangaysDropdown((prev) => !prev)
                            }
                        }>
                            <p className="text-md text-citrus-pink font-semibold">{
                                selectedBarangay ? barangays[selectedBarangay].name : "Select Barangay"
                            }</p>
                            <FontAwesomeIcon className={`text-citrus-pink ${barangaysDropdown ? "rotate-180" : ""} transition-all duration-200`}  icon={faCaretDown}/>
                        </div>
                        <div className={`absolute w-full h-33 bg-slate-200 px-3 py-1.5 z-10 ${barangaysDropdown ? "top-10 opacity-100 pointer-events-auto" : "top-5 opacity-0 pointer-events-none"} left-0 right-0 rounded-lg shadow-lg overflow-y-scroll no-scrollbar transition-all duration-200`}>
                            { barangays.map((barangay, i) => (
                                <div key={barangay.code} className="text-md text-citrus-pink font-semibold cursor-pointer" onClick={() => {
                                    setSelectedBarangay(i.toString())
                                    setBarangaysDropdown(false)
                                }}>{barangay.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (<></>) }
            { selectedBarangay ? (
                <div>
                    <label className="block text-sm font-semibold text-citrus-orange">Street / Building / House No.</label>
                    <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="text" onChange={(e) => {
                        setAddress(e.target.value)
                    }} placeholder="Street / Building / House No."/>
                </div>
            ) : (<></>)}
            <button className={`${isValid ? "bg-citrus-rose cursor-pointer transition-all duration-500 hover:text-rose-300 hover:scale-105 hover:shadow-lg" : "bg-citrus-rose/50"} w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`}
                onClick={async() => {
                    if(isValid) {
                        onNext({
                            name,
                            address: {
                                region: regions[selectedRegion].name,
                                city: cities[selectedCity].name,
                                barangay: barangays[selectedBarangay].name,
                                address
                            }
                        })
                    }
                }}
            >
                Next
            </button>
        </div>
    )
}