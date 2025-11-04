const validateEmail = (input: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(input);
};

const validateCPF = (input: string): boolean => {
  const numericCpf = input.replace(/[^\d]/g, '');
  if (numericCpf.length !== 11) return false;

  // CPF com todos os dígitos iguais é inválido
  if (/^(\d)\1{10}$/.test(numericCpf)) return false;

  const calcCheckDigit = (cpf: string, factor: number): number => {
    let total = 0;
    for (let i = 0; i < factor - 1; i++) {
      total += parseInt(cpf[i]) * (factor - i);
    }
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const digit1 = calcCheckDigit(numericCpf, 10);
  const digit2 = calcCheckDigit(numericCpf, 11);

  return digit1 === parseInt(numericCpf[9]) &&
         digit2 === parseInt(numericCpf[10]);
};

const validateEmailOrCpf = (input: string): boolean => {
  return validateEmail(input) || validateCPF(input);
};



const validatePassword = (password: string): { isValid: boolean; error: string } => {
  if (password.length < 7) {
    return {
      isValid: false,
      error: 'A senha deve ter no mínimo 7 caracteres.',
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter) {
    return {
      isValid: false,
      error: 'A senha deve conter pelo menos uma letra e um número.',
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      error: 'A senha deve conter pelo menos uma letra e um número.',
    };
  }

  return { isValid: true, error: '' };
};

const validateTelefone = (input: string): boolean => {
  const numericPhone = input.replace(/[^\d]/g, '');
  console.log(numericPhone)
  // Válido se tiver 10 (fixo) ou 11 (celular) dígitos e começar com DDD entre 11 e 99
  if (numericPhone.length !== 10 && numericPhone.length !== 11) {

    return false;
  }

  const ddd = parseInt(numericPhone.slice(0, 2));
  if (ddd < 11 || ddd > 99) {
    return false;
  }

  // Se for celular (11 dígitos), o terceiro dígito deve ser 9
  if (numericPhone.length === 11 && numericPhone[2] !== '9') {
    return false;
  }

  return true;
};

const validatePixKey = (tipo: 'cpf' | 'email' | 'telefone' | 'aleatoria', chave: string): boolean => {
  switch (tipo) {
    case 'cpf':
      return validateCPF(chave);
    case 'email':
      return validateEmail(chave);
    case 'telefone':
      return validateTelefone(chave);
    case 'aleatoria':
      return chave.length > 0; // ou outro critério
    default:
      return false;
  }
};


export { validateEmailOrCpf, validatePassword, validateTelefone, validatePixKey, validateCPF, validateEmail };