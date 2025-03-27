import { useEffect } from "react";

type SideMenuProps = {
    onChange: any;
    defaultValue: string;
    values: string[];
    data: any;
    name: string;
};
export function DTSelection({
    onChange,
    defaultValue,
    values,
    data,
    name,
}: SideMenuProps) {
    useEffect(() => {
        // Simuliere ein Change-Event mit dem initialen Wert
        const event = {
            target: { value: defaultValue, name },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
    }, []);
    return (
        <>
            <select onChange={onChange} value={data} name={name}>
                {values.map((v: string, i: number) => {
                    return (
                        <option key={i} value={v} selected={v === defaultValue}>
                            {v}
                        </option>
                    );
                })}
            </select>
        </>
    );
}
