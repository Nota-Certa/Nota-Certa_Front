import BarraLateral from "@/app/components/barraLateral";
import { Tabela } from "@/app/components/tabela";

export default function ListagemNotas(){
  return(
    <div className="flex flex-row">
      <BarraLateral></BarraLateral>
      <div className="flex flex-col justify-center items-center px-11 bg-[#F2F5FA]">

        <div className="flex flex-row">
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-5xl font-bold">Invoices</h1>
            <p className="text-base font-normal">Veja suas notas e os status delas</p>
          </div>
          <div>barra de pesquisa</div>
        </div>
        <Tabela></Tabela>
      </div>
    </div>
  );
}