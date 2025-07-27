This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Nota Certa

### Sistema de Gerenciamento de Notas Fiscais B2B

![Licença](https://img.shields.io/badge/license-MIT-blue)

O projeto **Nota Certa** é um sistema completo para geração e gerenciamento de notas fiscais B2B, desenvolvido para empresas e pequenos empreendedores que buscam uma solução eficiente, centralizada e automatizada para o seu fluxo de trabalho fiscal.

---

## Índice

* [Sobre o Projeto](#sobre-o-projeto)
* [Funcionalidades Principais](#funcionalidades-principais)
* [Modelo de Negócio](#modelo-de-negócio)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Arquitetura de Microserviços](#arquitetura-de-microserviços)
* [Como Executar o Projeto](#como-executar-o-projeto)
* [Equipe](#equipe)
* [Licença](#licença)

---

## Sobre o Projeto

O Nota Certa nasceu da necessidade de otimizar o processo de emissão e controle de notas fiscais eletrônicas no ambiente corporativo B2B. Muitas empresas enfrentam dificuldades com processos manuais, múltiplos sistemas e planilhas, resultando em falta de controle, insegurança e ineficiência.

Nossa solução preenche essa lacuna, oferecendo uma plataforma segura, confiável e automatizada para gerenciar o ciclo completo de documentos fiscais. Com o Nota Certa, empresas podem gerar, consultar e acompanhar notas fiscais emitidas para seus clientes, utilizando dashboards informativos, alertas e um histórico centralizado.

🔗 **[Acesse os Wireframes no Figma](https://www.figma.com/design/mEtesM44dH4aDlXLsirp0t/SaS-WEB?node-id=0-1&p=f&t=pPcIjZNHGk1KZkbB-0)**

---

## Funcionalidades Principais

A versão atual do projeto entrega as seguintes funcionalidades no plano **Freemium**:

* ✔️ **Emissão de Notas:** Emissão de até 10 notas fiscais por mês (atualmente simuladas via JSON).
* 👤 **Cadastro de Clientes:** Gerenciamento de clientes finais (pessoas físicas e jurídicas).
* 📄 **Geração de Faturas:** Criação de faturas detalhadas com itens, valores, datas e condições de pagamento.
* 🔍 **Busca e Filtros:** Consulta avançada de notas por período, número ou documento do cliente.
* 📊 **Acompanhamento de Status:** Monitore o status das notas (pendente, paga, cancelada).
* 📈 **Dashboard de Indicadores:** Visualize métricas e indicadores chave sobre seu faturamento e emissões.
* 📤 **Exportação:** Exporte os dados das notas em formato JSON.

Plano **Básico**:
* ✔️ **Funcionalidades do Freemium:** Todas as funcionalidades do plano Freemium.
* 📄 **Limite de notas aumentado:** Emissão de até 100 notas fiscais por mês.
* 📤 **Exportação:** Exporte os dados das notas em formato XML, além do padrão em JSON.

Plano **Premium**:
* ✔️ **Funcionalidades do Básico:** Todas as funcionalidades do plano Básico.
* 📄 **Limite de notas aumentado:** Emissão de até 500 notas fiscais por mês.
* 📤 **Exportação:** Exporte os dados das notas em formato CSV e PDF, além das padrões XML e JSON.

#### Funcionalidades Futuras (Planos Pagos)
* **Notificações:** Alertas por e-mail e webhooks (funcionalidade aspiracional).
* **Integração Real:** Emissão de notas fiscais reais via integração com prefeituras ou serviços de API fiscal (funcionalidade aspiracional).

---

## Modelo de Negócio

O sistema opera num modelo de assinatura mensal com três níveis de plano:

| Plano     | Notas/mês | Limite de Funcionários | Preço     |
| :-------- | :-------- | :--------------------- | :-------- |
| Freemium  | 10        | 3                      | Gratuito  |
| Básico    | 100       | 10                     | R$ 29,90  |
| Premium   | 500       | 50                     | R$ 59,90  |

*Para os planos **Básico** e **Premium**, notas excedentes podem ser emitidas ao custo de R$ 0,50 por nota.*

---

## Tecnologias Utilizadas

* **Frontend:** **NextJS** - Estrutura modular, fortemente tipada e escalável, ideal para microserviços.
* **Backend:** **NestJS** - Estrutura modular, fortemente tipada e escalável, ideal para microserviços.
* **Banco de Dados:** **PostgreSQL** - Sistema de gerenciamento de banco de dados relacional robusto e confiável.
* **Cache e Mensageria:** **Redis** - Utilizado para caching de dados e como broker de mensagens para a comunicação entre microserviços (Pub/Sub).
* **Orquestração e Ambiente:** **Docker** & **Docker Compose** - Criação de um ambiente de desenvolvimento e produção consistente e isolado.
* **CI/CD:** **GitHub Actions** - Automação de processos de build, teste e deploy..
* **Componentes:** **Biblioteca Shadcn**, 🔗 **[Acesse a documentação da biblioteca](https://ui.shadcn.com/docs/components)**


---

## Como Executar o Projeto

Para executar o ambiente de desenvolvimento localmente, siga os passos abaixo.

#### Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Nota-Certa/Nota-Certa_Back.git
    cd Nota-Certa_Back
    ```

2.  **Configure as variáveis de ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo `.env`.
    ```bash
    cp .env.example .env
    ```
    Em seguida, abra o ficheiro `.env` e preencha as variáveis necessárias.

3.  **Rode o Projeto**
    Utilize o nom run dev para iniciar o front-end e acessar os serviços.
    ```bash
    npm run dev
    ```
4.  **Acesse a aplicação:**
    * A API do Gateway estará disponível em: `http://localhost:8080` ou se a porta 8080 estiver em uso o console da IDE mostrará a porta que está sendo usada.

---

## Equipe

* Carlos Alberto de Almeida Castro Neto
* Daniel Oliveira Carneiro Leao
* Dayanne Carolina e Silva Portela
* Jurandir Guilherme Batista da Silva
* Leonardo da Silva Viana Filho
* Lucas Gonçalves Venancio
* Maria Gabrielly Anísio de Santana
* Stella Nazário Anacleto de Oliveira
* Tom Jones Silva Gomes Ramos
