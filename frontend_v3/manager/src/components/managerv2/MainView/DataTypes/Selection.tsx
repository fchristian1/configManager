type SideMenuProps = {
    onChange: any;
    values: string[];
    data: any;
    name: string;
};
export function DTSelection({ onChange, values, data, name }: SideMenuProps) {
    return (
        <select onChange={onChange} value={data} name={name}>
            {values.map((v: string, i: number) => {
                return (
                    <option key={i} value={v}>
                        {v}
                    </option>
                );
            })}
        </select>
    );
}
