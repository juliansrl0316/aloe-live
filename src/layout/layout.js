import logo from "../../public/image/logo.png"
import Image from "next/image";


export default function Layout({ children }) {
    return (
        <div className="flex h-screen bg-slate-50">
            <div className="m-auto bg-slate-50 w-3/5 max-h-min max-w-max grid lg:grid-cols-2">
                <div className="relative bg-gradient-to-b from-amazon_blue-base to-white  flex justify-evenly ">
                    <Image src={logo} className="object-contain"/>
                </div>
                <div className="right flex flex-col justify-evenly bg-white ">
                    <div className="text-center py-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}