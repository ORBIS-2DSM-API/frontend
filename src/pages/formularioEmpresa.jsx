import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Home,
  Hash,
  DollarSign,
  GraduationCap,
  Bell,
  Building2,
  MapPinned
} from 'lucide-react';

function FormularioEmpresa() {
  const { nomeEmpresa } = useParams();
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    sexo: '',
    rua: '',
    numero: '',
    complemento: '',
    estado: '',
    cidade: '',
    celular: '',
    rendaFamiliar: '',
    escolaridade: '',
    email: '',
    cep: '',
    metodoNotificacao: 'email'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // URL da API - usando variável de ambiente
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/candidates';

  const handleChange = (event) => {
    const { id, value } = event.target;
    let formattedValue = value;
    let fieldError = '';

    // Validações em tempo real
    switch (id) {
      case 'nomeCompleto':
        if (value && !/^[A-Za-zÀ-ÿ\s]+$/.test(value)) {
          fieldError = 'Nome deve conter apenas letras e espaços.';
        }
        break;

      case 'cpf':
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
        if (value && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formattedValue)) {
          fieldError = 'CPF deve estar no formato 000.000.000-00';
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldError = 'Email inválido. Ex: exemplo@email.com';
        }
        break;

      case 'dataNascimento':
        // Remove caracteres não numéricos
        const numbersOnly = value.replace(/\D/g, '');
        
        // Aplica a máscara DD/MM/AAAA
        if (numbersOnly.length <= 8) {
          formattedValue = numbersOnly
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{4})\d+?$/, '$1');
        }

        // Valida o formato da data
        if (value && !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/.test(formattedValue)) {
          fieldError = 'Data deve estar no formato DD/MM/AAAA';
        } else if (formattedValue.length === 10) {
          // Se o formato está correto, valida a data
          const [day, month, year] = formattedValue.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          
          // Verifica se é uma data válida
          if (
            date.getDate() !== day ||
            date.getMonth() + 1 !== month ||
            date.getFullYear() !== year ||
            date > new Date()
          ) {
            fieldError = 'Data inválida';
          } else {
            // Calcula a idade
            const age = calculateAge(formattedValue);
            if (age < 18) {
              fieldError = 'Você deve ter pelo menos 18 anos.';
            }
          }
        }
        break;

      case 'celular':
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
        if (value && !/^\(\d{2}\) \d{5}-\d{4}$/.test(formattedValue)) {
          fieldError = 'Celular deve estar no formato (00) 00000-0000';
        }
        break;

      case 'cep':
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{3})\d+?$/, '$1');
        if (value && !/^\d{5}-\d{3}$/.test(formattedValue)) {
          fieldError = 'CEP deve estar no formato 00000-000';
        }
        break;

      case 'numero':
        // Remove caracteres especiais exceto hífen
        formattedValue = value.replace(/[^0-9A-Za-z\-]/g, '').slice(0, 10);
        if (value && !/^[0-9A-Za-z\-]{1,10}$/.test(formattedValue)) {
          fieldError = 'Número deve conter apenas números, letras e hífen (máx. 10 caracteres)';
        } else if (!formattedValue) {
          fieldError = 'Número é obrigatório';
        }
        break;

      default:
        break;
    }

    setFormData({ ...formData, [id]: formattedValue });
    setErrors({ ...errors, [id]: fieldError });
  };

  // Modifica a função calculateAge para trabalhar com o formato DD/MM/AAAA
  const calculateAge = (birthDateStr) => {
    const [day, month, year] = birthDateStr.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Verificar duplicidade de email ou CPF
  const checkDuplicate = async (field, value) => {
    try {
      const response = await axios.post(`${API_URL}/check-duplicate`, {
        [field]: value
      });
      
      if (response.data.duplicate) {
        setErrors(prev => ({
          ...prev,
          [field]: response.data.message
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Erro ao verificar duplicidade de ${field}:`, error);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Limpar mensagens anteriores
    setSubmitMessage({ type: '', text: '' });
    
    if (await validate()) {
      setIsSubmitting(true);
      
      try {
        // Mapear os dados do formulário para o formato esperado pelo backend
        const [day, month, year] = formData.dataNascimento.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        const backendData = {
          full_name: formData.nomeCompleto,
          cpf: formData.cpf,
          birth_date: formattedDate,
          candidate_age: calculateAge(formData.dataNascimento),
          gender: formData.sexo === 'masculino' ? 'M' : formData.sexo === 'feminino' ? 'F' : 'O',
          street: formData.rua,
          number: formData.numero,
          complement: formData.complemento || null,
          state: formData.estado,
          city: formData.cidade,
          phone: formData.celular,
          family_income: parseFloat(formData.rendaFamiliar) || 0,
          email: formData.email,
          education_level: formData.escolaridade,
          notification_method: formData.metodoNotificacao,
          postal_code: formData.cep
        };

        console.log('Dados sendo enviados:', backendData);
        
        // Enviar dados para o backend
        const response = await axios.post(API_URL, backendData);
        console.log('Resposta do servidor:', response.data);
        
        if (response.data.success) {
          setSubmitMessage({
            type: 'success',
            text: 'Cadastro realizado com sucesso!'
          });
          
          // Limpar formulário após sucesso
          setFormData({
            nomeCompleto: '',
            dataNascimento: '',
            cpf: '',
            sexo: '',
            rua: '',
            numero: '',
            complemento: '',
            estado: '',
            cidade: '',
            celular: '',
            rendaFamiliar: '',
            escolaridade: '',
            email: '',
            cep: '',
            metodoNotificacao: 'email'
          });
        }
      } catch (error) {
        console.error('Erro detalhado ao enviar formulário:', error);
        console.error('Dados da resposta de erro:', error.response?.data);
        
        let errorMessage = 'Falha no envio do formulário. ';
        
        if (error.response) {
          // O servidor respondeu com um status de erro
          if (error.response.data?.errors) {
            // Se houver erros específicos de validação
            const validationErrors = error.response.data.errors
              .map(err => err.msg)
              .join(', ');
            errorMessage += validationErrors;
          } else if (error.response.data?.message) {
            // Se houver uma mensagem de erro específica
            errorMessage += error.response.data.message;
          } else {
            // Erro genérico do servidor
            errorMessage += `Erro do servidor: ${error.response.status}`;
          }
        } else if (error.request) {
          // A requisição foi feita mas não houve resposta
          errorMessage += 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else {
          // Erro na configuração da requisição
          errorMessage += 'Erro ao preparar a requisição.';
        }
        
        setSubmitMessage({
          type: 'error',
          text: errorMessage
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSubmitMessage({
        type: 'error',
        text: 'Por favor, corrija os erros no formulário.'
      });
    }
  };

  const validate = async () => {
    let isValid = true;
    const newErrors = {};

    // Nome completo
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório.';
      isValid = false;
    }

    // Data de Nascimento
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
      isValid = false;
    } else {
      const [day, month, year] = formData.dataNascimento.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      
      if (
        isNaN(birthDate.getTime()) ||
        birthDate > today ||
        year < 1900 ||
        year > today.getFullYear()
      ) {
        newErrors.dataNascimento = 'Data de nascimento inválida.';
        isValid = false;
      }
    }

    // CPF
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório.';
      isValid = false;
    } else if (!formData.cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
      newErrors.cpf = 'CPF inválido (formato: 000.000.000-00).';
      isValid = false;
    } else {
      // Verificar duplicidade de CPF
      try {
        const response = await axios.post(`${API_URL}/check-duplicate`, { cpf: formData.cpf });
        if (response.data.duplicate) {
          newErrors.cpf = response.data.message;
          isValid = false;
        }
      } catch (error) {
        console.error('Erro ao verificar CPF:', error);
      }
    }

    // Sexo (Gender)
    if (!formData.sexo) {
      newErrors.sexo = 'Sexo é obrigatório.';
      isValid = false;
    } else if (!['masculino', 'feminino', 'outro'].includes(formData.sexo)) {
      newErrors.sexo = 'Valor inválido para sexo.';
      isValid = false;
    }

    // Endereço
    if (!formData.rua.trim()) {
      newErrors.rua = 'Rua é obrigatória.';
      isValid = false;
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório.';
      isValid = false;
    }

    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório.';
      isValid = false;
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória.';
      isValid = false;
    }

    // CEP
    if (!formData.cep) {
      newErrors.cep = 'CEP é obrigatório.';
      isValid = false;
    } else if (!formData.cep.match(/^\d{5}-\d{3}$/)) {
      newErrors.cep = 'CEP inválido (formato: 00000-000).';
      isValid = false;
    }

    // Celular
    if (!formData.celular) {
      newErrors.celular = 'Celular é obrigatório.';
      isValid = false;
    } else if (!formData.celular.match(/^\(\d{2}\) \d{5}-\d{4}$/)) {
      newErrors.celular = 'Celular inválido (formato: (XX) XXXXX-XXXX).';
      isValid = false;
    }

    // Renda Familiar
    if (formData.rendaFamiliar !== '') {
      const rendaValue = parseFloat(formData.rendaFamiliar);
      if (isNaN(rendaValue) || rendaValue < 0) {
        newErrors.rendaFamiliar = 'Renda familiar deve ser um número positivo.';
        isValid = false;
      }
    }

    // Escolaridade
    if (!formData.escolaridade) {
      newErrors.escolaridade = 'Escolaridade é obrigatória.';
      isValid = false;
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido.';
      isValid = false;
    } else {
      // Verificar duplicidade de email
      try {
        const response = await axios.post(`${API_URL}/check-duplicate`, { email: formData.email });
        if (response.data.duplicate) {
          newErrors.email = response.data.message;
          isValid = false;
        }
      } catch (error) {
        console.error('Erro ao verificar email:', error);
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-[#1E3A8A] p-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Formulário de Inscrição - {nomeEmpresa}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Estilo base para todos os inputs e selects */}
            <style jsx>{`
              input, select {
                height: 2.75rem;
                font-size: 0.875rem;
                font-family: Inter, system-ui, sans-serif;
                outline: none;
              }
              input::placeholder {
                font-size: 0.875rem;
                font-family: Inter, system-ui, sans-serif;
              }
              input:focus, select:focus {
                outline: none;
              }
            `}</style>

            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <User size={18} />
                Dados Pessoais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="nomeCompleto"
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      className={`pl-9 w-full rounded-lg border ${
                        errors.nomeCompleto ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200 font-normal focus:border-gray-400`}
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                  {errors.nomeCompleto && (
                    <p className="mt-1 text-xs font-medium text-red-600 animate-fadeIn">{errors.nomeCompleto}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo
                  </label>
                  <div className="relative">
                    <select
                      id="sexo"
                      value={formData.sexo}
                      onChange={handleChange}
                      className={`pl-9 w-full rounded-lg border ${
                        errors.sexo ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    >
                      <option value="">Selecione o sexo</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                    </select>
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                  {errors.sexo && (
                    <p className="mt-1 text-xs font-medium text-red-600 animate-fadeIn">{errors.sexo}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      placeholder="DD/MM/AAAA"
                      maxLength="10"
                      className={`pl-9 w-full rounded-lg border ${
                        errors.dataNascimento ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200 font-normal focus:border-gray-400`}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                  {errors.dataNascimento && (
                    <p className="mt-1 text-xs font-medium text-red-600 animate-fadeIn">{errors.dataNascimento}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      maxLength="14"
                      className={`pl-10 w-full rounded-lg border ${
                        errors.cpf ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                  {errors.cpf && (
                    <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.cpf}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exemplo@email.com"
                      className={`pl-10 w-full rounded-lg border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <MapPin size={18} />
                Endereço
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      placeholder="00000-000"
                      maxLength="9"
                      className={`pl-9 w-full rounded-lg border text-sm ${
                        errors.cep ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    />
                    <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                  {errors.cep && (
                    <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.cep}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <div className="relative">
                    <select
                      id="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className={`pl-9 w-full rounded-lg border text-sm ${
                        errors.estado ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    >
                      <option value="">Selecione um estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                  {errors.estado && (
                    <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.estado}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      className={`pl-9 w-full rounded-lg border text-sm ${
                        errors.cidade ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    />
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                  {errors.cidade && (
                    <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.cidade}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">
                    Rua
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="rua"
                      value={formData.rua}
                      onChange={handleChange}
                      className={`pl-9 w-full rounded-lg border text-sm ${
                        errors.rua ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    />
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                  {errors.rua && (
                    <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.rua}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      className={`pl-9 w-full rounded-lg border text-sm ${
                        errors.numero ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                  {errors.numero && (
                    <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.numero}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="complemento"
                      value={formData.complemento}
                      onChange={handleChange}
                      className={`pl-9 w-full rounded-lg border text-sm ${
                        errors.complemento ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    />
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <GraduationCap size={18} />
                Informações Adicionais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">
                    Celular
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="celular"
                      value={formData.celular}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      maxLength="15"
                      className={`pl-10 w-full rounded-lg border ${
                        errors.celular ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                  {errors.celular && (
                    <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.celular}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="rendaFamiliar" className="block text-sm font-medium text-gray-700 mb-1">
                    Renda Familiar (R$)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="rendaFamiliar"
                      value={formData.rendaFamiliar}
                      onChange={handleChange}
                      step="0.01"
                      className={`pl-10 w-full rounded-lg border ${
                        errors.rendaFamiliar ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                  {errors.rendaFamiliar && (
                    <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.rendaFamiliar}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="escolaridade" className="block text-sm font-medium text-gray-700 mb-1">
                    Escolaridade
                  </label>
                  <div className="relative">
                    <select
                      id="escolaridade"
                      value={formData.escolaridade}
                      onChange={handleChange}
                      className={`pl-10 w-full rounded-lg border ${
                        errors.escolaridade ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm transition-all duration-200`}
                    >
                      <option value="">Selecione a escolaridade</option>
                      <option value="Fundamental Incompleto">Fundamental Incompleto</option>
                      <option value="Fundamental Completo">Fundamental Completo</option>
                      <option value="Médio Incompleto">Médio Incompleto</option>
                      <option value="Médio Completo">Médio Completo</option>
                      <option value="Superior Incompleto">Superior Incompleto</option>
                      <option value="Superior Completo">Superior Completo</option>
                      <option value="Pós-Graduação">Pós-Graduação</option>
                    </select>
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                  {errors.escolaridade && (
                    <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.escolaridade}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="metodoNotificacao" className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Notificação
                  </label>
                  <div className="relative">
                    <select
                      id="metodoNotificacao"
                      value={formData.metodoNotificacao}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 shadow-sm transition-all duration-200"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                    <Bell className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mx-auto max-w-[180px] py-2.5 px-6 text-white font-inter text-lg font-semibold rounded-full shadow-md block whitespace-nowrap
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#1E3A8A] hover:bg-[#172554] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2'}`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Inscrição'}
              </button>
            </div>

            {submitMessage.type && (
              <div className={`mt-4 p-4 rounded-lg ${
                submitMessage.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-400' 
                  : 'bg-red-100 text-red-700 border border-red-400'
              }`}>
                {submitMessage.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormularioEmpresa;