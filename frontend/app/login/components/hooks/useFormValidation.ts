import { UserType, FormData } from "../types/user";

export const useFormValidation = () => {
	const validateEmail = (email: string): boolean => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	const validatePassword = (password: string): boolean => {
		return password.length >= 6;
	};

	const validateForm = (
		formData: FormData,
		showRegister: boolean,
		userType: UserType
	): string[] => {
		const errors: string[] = [];

		if (!formData.email) {
			errors.push("Email é obrigatório");
		} else if (!validateEmail(formData.email)) {
			errors.push("Email inválido");
		}

		if (!formData.password) {
			errors.push("Senha é obrigatória");
		} else if (!validatePassword(formData.password)) {
			errors.push("Senha deve ter pelo menos 6 caracteres");
		}

		if (showRegister) {
			if (!formData.nome) errors.push("Nome é obrigatório");

			if (userType === "vendor") {
				if (!formData.nomeBanca)
					errors.push("Nome da banca é obrigatório");
				if (!formData.localizacao)
					errors.push("Localização é obrigatória");
			}
		}

		return errors;
	};

	return { validateForm };
};
