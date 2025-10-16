export function formatAmount(amount: number): string {
    // Convertir le montant en chaîne de caractères
    const amountString = amount.toFixed(2); // Garantir 2 décimales
    // Diviser la partie entière et la partie décimale
    const [integerPart, decimalPart] = amountString.split('.');
  
    // Ajouter des séparateurs de milliers à la partie entière
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    // Retourner le montant formaté avec la partie décimale
    return `${formattedInteger}.${decimalPart}`;
  }
  