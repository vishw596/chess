export const Button = ({children,onClick}:{children:React.ReactNode,onClick:()=>void}) => {
    return (
        <button className="bg-amber-200 hover:bg-amber-300 text-slate-800 font-bold border rounded-lg md:px-18 md:py-5 px-5 py-5cursor-pointer" onClick={onClick}>
            {children}
        </button>
    );
};
