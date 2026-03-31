export default function ContractorsFilters({ filters, onChange }) {
    const update = e => {
        const { name, value } = e.target;
        onChange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const reset = () => {
        onChange({
            name: "",
            nip: "",
            city: "",
            address: "",
            postal_code: "",
            contact_person: ""
        });
    };

    return (
        <div className="filters">
            <h4>KRYTERIA WYSZUKIWANIA</h4>

            <label>Nazwa firmy</label>
            <input name="name" value={filters.name} onChange={update} />

            <label>NIP</label>
            <input name="nip" value={filters.nip} onChange={update} />

            <label>Miasto</label>
            <input name="city" value={filters.city} onChange={update} />

            <label>Adres</label>
            <input name="address" value={filters.address} onChange={update} />

            <label>Kod pocztowy</label>
            <input name="postal_code" value={filters.postal_code} onChange={update} />

            <label>Osoba kontaktowa</label>
            <input
                name="contact_person"
                value={filters.contact_person}
                onChange={update}
                placeholder="Imię lub nazwisko"
            />

            <button onClick={reset}>Resetuj</button>
        </div>
    );
}