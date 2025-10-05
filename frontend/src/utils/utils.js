export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
}
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateGuardianConsent = async (userData) => {
    const element = document.createElement('div');
    element.style.width = '210mm';
    element.style.padding = '20mm';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.lineHeight = '1.6';
    element.style.color = '#333';

    element.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2b64a9; padding-bottom: 20px;">
      <h1 style="color: #2b64a9; margin-bottom: 10px;">ZGODA OPIEKUNA PRAWNEGO</h1>
      <h2 style="color: #2b64a9; margin-bottom: 10px;">na udział w wolontariacie</h2>
      <p>Krakowskie Cyfrowe Centrum Wolontariatu</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="color: #2b64a9; border-bottom: 1px solid #eee; padding-bottom: 5px;">Dane osobowe wolontariusza</h2>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Imię i nazwisko:</strong> ${userData?.volunteer?.firstName || ''} ${userData?.volunteer?.lastName || ''}</p>
        <p><strong>Data urodzenia:</strong> ${userData?.volunteer?.birthDate || 'nie podano'}</p>
        <p><strong>Adres email:</strong> ${userData?.volunteer?.email || userData?.email || 'nie podano'}</p>
        <p><strong>Telefon:</strong> ${userData?.volunteer?.phone || 'nie podano'}</p>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="color: #2b64a9; border-bottom: 1px solid #eee; padding-bottom: 5px;">Umiejętności i kompetencje</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 12px; background-color: #f2f2f2; text-align: left;">Umiejętności</th>
          <th style="border: 1px solid #ddd; padding: 12px; background-color: #f2f2f2; text-align: left;">Języki obce</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 12px;">${userData?.volunteer?.skills ? Object.values(userData.volunteer.skills).join(', ') : 'nie podano'}</td>
          <td style="border: 1px solid #ddd; padding: 12px;">${userData?.volunteer?.languages ? Object.values(userData.volunteer.languages).join(', ') : 'nie podano'}</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="color: #2b64a9; border-bottom: 1px solid #eee; padding-bottom: 5px;">Dostępność</h2>
      <p><strong>Preferowane role:</strong> ${userData?.volunteer?.preferredRoles || 'nie podano'}</p>
      <p><strong>Transport:</strong> ${userData?.volunteer?.transport || 'nie podano'}</p>
      <p><strong>Dostępność czasowa:</strong></p>
      <ul>
        ${userData?.volunteer?.availability ? Object.values(userData.volunteer.availability).map(slot => `<li>${slot}</li>`).join('') : '<li>nie podano</li>'}
      </ul>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="color: #2b64a9; border-bottom: 1px solid #eee; padding-bottom: 5px;">Oświadczenie opiekuna prawnego</h2>
      <p>Ja, niżej podpisany/a opiekun prawny wolontariusza <strong>${userData?.volunteer?.firstName || ''} ${userData?.volunteer?.lastName || ''}</strong>, oświadczam, że:</p>
      
      <ol>
        <li>Wyrażam zgodę na udział podopiecznego w działaniach wolontariackich organizowanych przez Krakowskie Cyfrowe Centrum Wolontariatu.</li>
        <li>Zapoznałem/am się z charakterem wykonywanych zadań oraz warunkami uczestnictwa.</li>
        <li>Jestem świadomy/a, że wolontariusz będzie podlegał obowiązującym w organizacji zasadom BHP i regulaminom.</li>
        <li>Wyrażam zgodę na przetwarzanie danych osobowych podopiecznego w zakresie niezbędnym do realizacji wolontariatu.</li>
        <li>Zobowiązuję się do poinformowania organizatora o ewentualnych przeciwwskazaniach zdrowotnych podopiecznego.</li>
      </ol>
    </div>

    <div style="margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px;">
      <p>................................................................................</p>
      <p><strong>Podpis opiekuna prawnego</strong></p>
      
      <div style="margin-top: 30px; font-style: italic;">
        <p>Data: _________________________</p>
      </div>
    </div>

    <div style="margin-top: 50px; font-size: 12px; color: #666; text-align: center;">
      <p>Dokument wygenerowany automatycznie przez system Krakowskiego Cyfrowego Centrum Wolontariatu</p>
      <p>Data wygenerowania: ${new Date().toLocaleDateString('pl-PL')}</p>
    </div>
  `;

    document.body.appendChild(element);

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            width: element.offsetWidth,
            height: element.offsetHeight
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`zgoda-opiekuna-${userData?.volunteer?.firstName || 'wolontariusz'}-${userData?.volunteer?.lastName || ''}.pdf`);
    } catch (error) {
        console.error('Błąd podczas generowania PDF:', error);
    } finally {
        document.body.removeChild(element);
    }
};