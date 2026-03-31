import html2pdf from "html2pdf.js";
export default function generateProtocol({ form, company, contact, processNumber }) {

  const today = new Date().toLocaleDateString("pl-PL");

  const protocolNumber = processNumber || "BRAK NUMERU";

  const html = `
  <div style="font-family: Arial; padding: 20px; font-size: 12px;">

    <!-- LOGO + HEADER -->
    <div style="display:flex; align-items:center; margin-bottom:10px;">
      <div style="font-weight:bold; font-size:20px;">
        <img src="data:image/png;base64,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" style="height:40px;"/>
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