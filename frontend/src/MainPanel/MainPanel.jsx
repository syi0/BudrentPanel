import NavBar from "../NavBar/NavBar";

export default function MainPanel() {

    return (
        <div>
            <NavBar />

            <div style={{ padding: "20px" }}>
                <h1>Panel główny</h1>
                <p>Tu będzie Twoja zawartość panelu...</p>
            </div>
        </div>
    );
}
