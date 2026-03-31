import html2pdf from "html2pdf.js";
export default function generateProtocol({ form, company, contact, processNumber }) {

  const today = new Date().toLocaleDateString("pl-PL");

  const protocolNumber = processNumber || "BRAK NUMERU";

  const html = `
  <div style="font-family: Arial; padding: 20px; font-size: 12px;">

    <!-- LOGO + HEADER -->
    <div style="display:flex; align-items:center; margin-bottom:10px;">
      <div style="font-weight:bold; font-size:20px;">
        <img src="../assets/budrent-logo.png" style="height:40px;"/>
      </div>
      <div style="margin-left:10px;">elektronarzędzia</div>
    </div>

    <!-- TYTUŁ -->
    <div style="border:1px solid #000; padding:10px; text-align:center; font-weight:bold;">
      PROTOKÓŁ ZLECENIA NR ${protocolNumber}
      <div style="font-weight:normal;">Data przyjęcia: ${today}</div>
    </div>

    <!-- KLIENT / WYKONAWCA -->
    <table style="width:100%; border-collapse:collapse; margin-top:10px;" border="1">
      <tr style="background:#eee; font-weight:bold;">
        <td style="padding:6px;">KLIENT</td>
        <td style="padding:6px;">WYKONAWCA</td>
      </tr>
      <tr>
        <td style="padding:8px; height:80px;">
          ${company?.name || ""}
          <br/>
          ${contact?.first_name || ""} ${contact?.last_name || ""}
          <br/>
          ${contact?.phone || ""}
          <br/>
          ${form.address || ""}
        </td>
        <td style="padding:8px;">
          BUDRENT SPÓŁKA Z O.O.<br/>
          Kołobrzeska 42<br/>
          10-434 Olsztyn<br/>
          NIP: 7394012163
        </td>
      </tr>
    </table>

    <!-- OPIS -->
    <table style="width:100%; border-collapse:collapse; margin-top:10px;" border="1">
      <tr style="background:#eee; font-weight:bold;">
        <td style="padding:6px;">OPIS ZLECENIA</td>
      </tr>
      <tr>
        <td style="padding:8px; height:80px;">
          ${form.description || ""}
        </td>
      </tr>
    </table>

    <!-- WYMIENIONE CZĘŚCI -->
    <table style="width:100%; border-collapse:collapse; margin-top:10px;" border="1">
      <tr style="background:#eee; font-weight:bold;">
        <td style="padding:6px;">WYMIENIONE CZĘŚCI</td>
      </tr>
      <tr>
        <td style="padding:8px; height:60px;"></td>
      </tr>
    </table>

    <!-- ROZLICZENIE -->
    <table style="width:100%; border-collapse:collapse; margin-top:10px;" border="1">
      <tr style="background:#eee; font-weight:bold;">
        <td style="padding:6px;">ROZLICZENIE</td>
      </tr>
      <tr>
        <td style="padding:8px; height:60px;"></td>
      </tr>
    </table>

    <!-- ZALICZKA -->
    <table style="width:100%; border-collapse:collapse; margin-top:10px;" border="1">
      <tr style="background:#eee; font-weight:bold;">
        <td style="padding:6px;">ZALICZKA</td>
      </tr>
      <tr>
        <td style="padding:8px; height:40px;">
          ${form.advance_amount || ""} PLN
        </td>
      </tr>
    </table>

    <!-- PODPISY -->
    <table style="width:100%; border-collapse:collapse; margin-top:40px;" border="1">
      <tr style="background:#eee; font-weight:bold;">
        <td style="padding:6px;">PODPIS KLIENTA</td>
        <td style="padding:6px;">PIECZĄTKA I PODPIS WYKONAWCY</td>
      </tr>
      <tr>
        <td style="height:80px; text-align:center; vertical-align:bottom;">
          Potwierdzam odbiór kompletnego urządzenia
        </td>
        <td></td>
      </tr>
    </table>

  </div>
  `;

  html2pdf()
    .set({
      margin: 5,
      filename: "protokol.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { format: "a4", orientation: "portrait" },
    })
    .from(html)
    .save();
}