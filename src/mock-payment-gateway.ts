export type CardType = 'credit' | 'debit';

export type SandboxPaymentRequest = {
  cardNumber: string;
  cardType: CardType;
  amountCents: number;
};

export type SandboxPaymentResult =
  | { status: 'approved'; transactionId: string; cardType: CardType; message: string }
  | { status: 'declined' | 'timeout' | 'unsupported'; message: string }
  | { status: 'invalid'; message: string };

const testScenarios = new Map<string, 'approved' | 'declined' | 'timeout'>([
  ['4242424242424242', 'approved'],
  ['4000000000000002', 'declined'],
  ['4000000000009995', 'timeout'],
]);

let transactionSequence = 0;

export function normalizeCardNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidCardNumber(value: string): boolean {
  const digits = normalizeCardNumber(value);
  if (!/^\d{13,19}$/.test(digits)) return false;

  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

export function isValidExpiry(value: string, today = new Date()): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  return year > today.getFullYear() || (year === today.getFullYear() && month >= today.getMonth() + 1);
}

export function isValidCvc(value: string): boolean {
  return /^\d{3,4}$/.test(value.trim());
}

export async function processSandboxPayment(request: SandboxPaymentRequest): Promise<SandboxPaymentResult> {
  const cardNumber = normalizeCardNumber(request.cardNumber);
  if (!isValidCardNumber(cardNumber) || request.amountCents <= 0) {
    return { status: 'invalid', message: 'Enter valid demo card details and an order total.' };
  }

  await new Promise((resolve) => window.setTimeout(resolve, 180));
  const scenario = testScenarios.get(cardNumber);
  if (!scenario) {
    return { status: 'unsupported', message: 'Card is not in the local sandbox test set. No charge was made.' };
  }

  if (scenario === 'declined') {
    return { status: 'declined', message: 'Sandbox payment declined. Your bag is unchanged; no charge was made.' };
  }
  if (scenario === 'timeout') {
    return { status: 'timeout', message: 'Sandbox payment timed out. Your bag is unchanged; no charge was made.' };
  }

  transactionSequence += 1;
  return {
    status: 'approved',
    transactionId: `SASI-DEMO-${String(transactionSequence).padStart(6, '0')}`,
    cardType: request.cardType,
    message: 'Sandbox payment approved. No charge was made.',
  };
}
