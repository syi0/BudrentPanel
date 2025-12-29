import "./Modal.css";

export default function MissingProfileModal({ onConfirm }) {
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Uzupełnij dane</h3>
                <p>
                    Aby korzystać z aplikacji, musisz uzupełnić
                    imię i nazwisko w ustawieniach.
                </p>

                <button onClick={onConfirm}>
                    Przejdź do ustawień
                </button>
            </div>
        </div>
    );
}
