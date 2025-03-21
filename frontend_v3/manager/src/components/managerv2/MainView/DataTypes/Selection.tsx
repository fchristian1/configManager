type SideMenuProps = { values: string[] };
export function DTSelection({ values }: SideMenuProps) {
    return (
        <select>
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
