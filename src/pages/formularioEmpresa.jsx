import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

  // URL da API
  const API_URL = 'http://localhost:3000/api/candidates';

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: '' }); 
  };

  // Função para calcular a idade a partir da data de nascimento
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
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

  const validate = async () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório.';
      isValid = false;
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
      isValid = false;
    }

    if (!formData.cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
      newErrors.cpf = 'CPF inválido (formato: 000.000.000-00).';
      isValid = false;
    }

    if (!formData.sexo) {
      newErrors.sexo = 'Sexo é obrigatório.';
      isValid = false;
    }

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

    if (!formData.celular.match(/^\(?\d{2}\)? \d{5}-\d{4}$/)) {
      newErrors.celular = 'Celular inválido (formato: (XX) XXXXX-XXXX).';
      isValid = false;
    }

    if (formData.rendaFamiliar !== '' && isNaN(parseFloat(formData.rendaFamiliar))) {
      newErrors.rendaFamiliar = 'Renda familiar deve ser um número.';
      isValid = false;
    }

    if (!formData.escolaridade) {
      newErrors.escolaridade = 'Escolaridade é obrigatória.';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido.';
      isValid = false;
    }

    if (!formData.cep) {
      newErrors.cep = 'CEP é obrigatório.';
      isValid = false;
    } else if (!formData.cep.match(/^\d{5}-\d{3}$/)) {
      newErrors.cep = 'CEP inválido (formato: 00000-000).';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Limpar mensagens anteriores
    setSubmitMessage({ type: '', text: '' });
    
    if (await validate()) {
      setIsSubmitting(true);
      
      try {
        // Verificar duplicidade de email e CPF
        const emailDuplicate = await checkDuplicate('email', formData.email);
        const cpfDuplicate = await checkDuplicate('cpf', formData.cpf);
        
        if (emailDuplicate || cpfDuplicate) {
          setSubmitMessage({
            type: 'error',
            text: 'Por favor, corrija os erros antes de enviar o formulário.'
          });
          setIsSubmitting(false);
          return;
        }
        
        // Calcular idade
        const age = calculateAge(formData.dataNascimento);
        
        // Mapear os dados do formulário para o formato esperado pelo backend
        const backendData = {
          full_name: formData.nomeCompleto,
          cpf: formData.cpf,
          birth_date: formData.dataNascimento,
          candidate_age: age,
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
        
        // Enviar dados para o backend
        const response = await axios.post(API_URL, backendData);
        
        if (response.data.success) {
          setSubmitMessage({
            type: 'success',
            text: 'Cadastro realizado com sucesso!'
          });
          
          // Limpar mensagem após 7 segundos
          setTimeout(() => {
            setSubmitMessage({ type: '', text: '' });
          }, 7000);
          
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
        } else {
          setSubmitMessage({
            type: 'error',
            text: response.data.message || 'Erro ao enviar formulário.'
          });
        }
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        
        if (error.response && error.response.data) {
          setSubmitMessage({
            type: 'error',
            text: error.response.data.message || 'Falha no envio do formulário. Por favor, tente novamente.'
          });
        } else {
          setSubmitMessage({
            type: 'error',
            text: 'Falha no envio do formulário. Por favor, tente novamente.'
          });
        }
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

  return (
    <div className="max-w-2xl h-full mx-auto pt-8 p-6 bg-white rounded-md shadow-md overflow-scroll">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Formulário para {nomeEmpresa.replace('-', ' ').toUpperCase()}
      </h1>
      
      {submitMessage.text && (
        <div className={`p-4 mb-6 rounded-md ${
          submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {submitMessage.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nomeCompleto" className="block text-gray-700 text-sm font-bold mb-2">
            Nome Completo:
          </label>
          <input
            type="text"
            id="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleChange}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.nomeCompleto ? 'border-red-500' : ''
            }`}
          />
          {errors.nomeCompleto && <p className="text-red-500 text-xs italic">{errors.nomeCompleto}</p>}
        </div>

        <div>
          <label htmlFor="dataNascimento" className="block text-gray-700 text-sm font-bold mb-2">
            Data de Nascimento:
          </label>
          <input
            type="date"
            id="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.dataNascimento ? 'border-red-500' : ''
            }`}
          />
          {errors.dataNascimento && <p className="text-red-500 text-xs italic">{errors.dataNascimento}</p>}
        </div>

        <div>
          <label htmlFor="cpf" className="block text-gray-700 text-sm font-bold mb-2">
            CPF:
          </label>
          <input
            type="text"
            id="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
            placeholder="000.000.000-00"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.cpf ? 'border-red-500' : ''
            }`}
          />
          {errors.cpf && <p className="text-red-500 text-xs italic">{errors.cpf}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="sexo" className="block text-gray-700 text-sm font-bold mb-2">
            Sexo:
          </label>
          <select
            id="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.sexo ? 'border-red-500' : ''
            }`}
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
            <option value="naoInformar">Não Informar</option>
          </select>
          {errors.sexo && <p className="text-red-500 text-xs italic">{errors.sexo}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="rua" className="block text-gray-700 text-sm font-bold mb-2">
              Rua:
            </label>
            <input
              type="text"
              id="rua"
              value={formData.rua}
              onChange={handleChange}
              required
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.rua ? 'border-red-500' : ''
              }`}
            />
            {errors.rua && <p className="text-red-500 text-xs italic">{errors.rua}</p>}
          </div>
          <div>
            <label htmlFor="numero" className="block text-gray-700 text-sm font-bold mb-2">
              Número:
            </label>
            <input
              type="text"
              id="numero"
              value={formData.numero}
              onChange={handleChange}
              required
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.numero ? 'border-red-500' : ''
              }`}
            />
            {errors.numero && <p className="text-red-500 text-xs italic">{errors.numero}</p>}
          </div>
          <div>
            <label htmlFor="complemento" className="block text-gray-700 text-sm font-bold mb-2">
              Complemento:
            </label>
            <input
              type="text"
              id="complemento"
              value={formData.complemento}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cep" className="block text-gray-700 text-sm font-bold mb-2">
            CEP:
          </label>
          <input
            type="text"
            id="cep"
            value={formData.cep}
            onChange={handleChange}
            required
            placeholder="00000-000"
            pattern="\d{5}-\d{3}"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.cep ? 'border-red-500' : ''
            }`}
          />
          {errors.cep && <p className="text-red-500 text-xs italic">{errors.cep}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="estado" className="block text-gray-700 text-sm font-bold mb-2">
              Estado:
            </label>
            <select
              id="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.estado ? 'border-red-500' : ''
              }`}
            >
              <option value="">Selecione</option>
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
            {errors.estado && <p className="text-red-500 text-xs italic">{errors.estado}</p>}
          </div>
          <div>
            <label htmlFor="cidade" className="block text-gray-700 text-sm font-bold mb-2">
              Cidade:
            </label>
            <input
              type="text"
              id="cidade"
              value={formData.cidade}
              onChange={handleChange}
              required
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.cidade ? 'border-red-500' : ''
              }`}
            />
            {errors.cidade && <p className="text-red-500 text-xs italic">{errors.cidade}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="celular" className="block text-gray-700 text-sm font-bold mb-2">
            Celular:
          </label>
          <input
            type="tel"
            id="celular"
            value={formData.celular}
            onChange={handleChange}
            required
            placeholder="(XX) XXXXX-XXXX"
            pattern="\(?\d{2}\)? \d{5}-\d{4}"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.celular ? 'border-red-500' : ''
            }`}
          />
          {errors.celular && <p className="text-red-500 text-xs italic">{errors.celular}</p>}
        </div>

        <div>
          <label htmlFor="rendaFamiliar" className="block text-gray-700 text-sm font-bold mb-2">
            Renda Familiar (R$):
          </label>
          <input
            type="number"
            id="rendaFamiliar"
            value={formData.rendaFamiliar}
            onChange={handleChange}
            step="0.01"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.rendaFamiliar ? 'border-red-500' : ''
            }`}
          />
          {errors.rendaFamiliar && <p className="text-red-500 text-xs italic">{errors.rendaFamiliar}</p>}
        </div>

        <div>
          <label htmlFor="escolaridade" className="block text-gray-700 text-sm font-bold mb-2">
            Escolaridade:
          </label>
          <select
            id="escolaridade"
            value={formData.escolaridade}
            onChange={handleChange}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.escolaridade ? 'border-red-500' : ''
            }`}
          >
            <option value="">Selecione</option>
            <option value="Fundamental Incompleto">Fundamental Incompleto</option>
            <option value="Fundamental Completo">Fundamental Completo</option>
            <option value="Médio Incompleto">Médio Incompleto</option>
            <option value="Médio Completo">Médio Completo</option>
            <option value="Superior Incompleto">Superior Incompleto</option>
            <option value="Superior Completo">Superior Completo</option>
            <option value="Pós-Graduação">Pós-Graduação</option>
          </select>
          {errors.escolaridade && <p className="text-red-500 text-xs italic">{errors.escolaridade}</p>}
        </div>

        <div>
          <label htmlFor="metodoNotificacao" className="block text-gray-700 text-sm font-bold mb-2">
            Método de Notificação:
          </label>
          <select
            id="metodoNotificacao"
            value={formData.metodoNotificacao}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${
            isSubmitting ? 'bg-indigo-300' : 'bg-indigo-500 hover:bg-indigo-700'
          } text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline`}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default FormularioEmpresa;