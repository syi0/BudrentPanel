export default function ContactsFilters({ filters, onChange }) {
    const update = e => {
        const { name, value } = e.target;
        onChange(prev => ({ ...prev, [name]: value }));
    };

    const reset = () => {
        onChange({
            company: "",
            first_name: "",
            last_name: "",
            email: "",
            verified: ""
        });
    };

    return (
        <div className="filters">
            <h4>KRYTERIA WYSZUKIWANIA</h4>

            <label>Firma</label>
            <input name="company" value={filters.company} onChange={update} />

            <label>Imię</label>
            <input name="first_name" value={filters.first_name} onChange={update} />

            <label>Nazwisko</label>
            <input name="last_name" value={filters.last_name} onChange={update} />

            <label>Email</label>
            <input name="email" value={filters.email} onChange={update} />

            <label>Zweryfikowany</label>
            <select name="verified" value={filters.verified} onChange={update}>
                <option value="">—</option>
                <option value="1">Tak</option>
                <option value="0">Nie</option>
            </select>

            <button onClick={reset}>Resetuj</button>
        </div>
    );
}
