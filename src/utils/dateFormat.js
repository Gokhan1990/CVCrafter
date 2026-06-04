const months = {
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const shortMonths = {
  tr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};



export function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  const isCurrent = ['Devam', 'Devam Ediyor', 'Present'].includes(dateStr);
  if (isCurrent) return lang === 'tr' ? 'Devam Ediyor' : 'Present';

  const parts = dateStr.split('-');
  if (parts.length === 1) return dateStr;

  const locale = lang === 'tr' ? 'tr' : 'en';
  const monthNames = shortMonths[locale];
  const monthIndex = parseInt(parts[1], 10) - 1;

  if (monthIndex < 0 || monthIndex > 11) return dateStr;
  const monthName = monthNames[monthIndex];

  if (parts.length === 2) {
    return lang === 'tr' ? `${parts[0]}-${monthName}` : `${monthName} ${parts[0]}`;
  }

  const day = parseInt(parts[2], 10);
  if (lang === 'tr') {
    return `${day} ${monthName} ${parts[0]}`;
  }
  return `${monthName} ${day}, ${parts[0]}`;
}
