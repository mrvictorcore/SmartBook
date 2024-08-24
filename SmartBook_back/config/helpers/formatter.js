export const formatValue = (value, unit) => {
    let formattedValue;
    switch (unit) {
      case 'kg':
      case 'l':
      case 'lb':
      case 'oz':
      case 'm':
      case 'cm':
        formattedValue = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        break;
      case 'g':
      case 'ml':
        formattedValue = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);
        break;
      case 'unid':
      case 'pcs':
      case 'pkg':
      case 'doc':
      case 'cjs':
      case 'bg':
      case 'jar':
      case 'btl':
      case 'sbr':
      case 'rl':
        formattedValue = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
        break;
      default:
        formattedValue = value;
    }
    return formattedValue;
  };
  