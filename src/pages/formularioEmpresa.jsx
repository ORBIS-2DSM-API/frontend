import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

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
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: '' }); 
  };

  const validate = () => {
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      // ===========================================
      // LOGICA DE ENVIO DE DADOS - backend
      // ===========================================
      console.log('Dados do Formulário:', formData);
      alert('Formulário enviado com sucesso!');
    } else {
      alert('Por favor, corrija os erros no formulário.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md overflow-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Formulário para {nomeEmpresa.replace('-', ' ').toUpperCase()}
      </h1>
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
            <option value="fundamentalIncompleto">Fundamental Incompleto</option>
            <option value="fundamentalCompleto">Fundamental Completo</option>
            <option value="medioIncompleto">Médio Incompleto</option>
            <option value="medioCompleto">Médio Completo</option>
            <option value="superiorIncompleto">Superior Incompleto</option>
            <option value="superiorCompleto">Superior Completo</option>
            <option value="posGraduacao">Pós-Graduação</option>
          </select>
          {errors.escolaridade && <p className="text-red-500 text-xs italic">{errors.escolaridade}</p>}
        </div>

        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default FormularioEmpresa;