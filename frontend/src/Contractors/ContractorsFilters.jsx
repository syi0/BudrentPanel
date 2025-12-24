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
            account_manager: ""
        });
    };

    return (
        <div className="filters">
            <h4>KRYTERIA WYSZUKIWANIA</h4>

            <label>Nazwa firmy</label>
            <input
                name="name"
                value={filters.name}
                onChange={update}
            />

            <label>NIP</label>
            <input
                name="nip"
                value={filters.nip}
                onChange={update}
            />

            <label>Miasto</label>
            <input
                name="city"
                value={filters.city}
                onChange={update}
            />

            <label>Opiekun</label>
            <input
                name="account_manager"
                value={filters.account_manager}
                onChange={update}
            />

            <button onClick={reset}>Resetuj</button>
        </div>
    );
}
