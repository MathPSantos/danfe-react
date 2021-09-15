import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Barcode from "react-barcode";

import { Cell } from "./components/Cell";

import { getXmlNodeValue, getXmlNodeValueAttr } from "./utils/xml";
import { toCurrency } from "./utils/values";

import nfe from "./assets/nfe1.xml";

import "./styles/index.scss";

function App() {
  const [nf, setNf] = useState();

  function parseNfeData(x) {
    const infNfeId = getXmlNodeValueAttr(x, "infNFe", "Id");
    const obj = {
      // orderId: nf.orderId,
      chaveNfe:
        getXmlNodeValue(x, "chNFe") || infNfeId.substr(infNfeId.length - 44),
      nf: getXmlNodeValue(x, "nNF"),
      serie: getXmlNodeValue(x, "serie"),
      natureza: getXmlNodeValue(x, "natOp"),
      emissao: moment(getXmlNodeValue(x, "dhEmi").slice(0, 10)).format(
        "DD/MM/YYYY"
      ),
      tipoEmissao: getXmlNodeValue(x, "tpNF"),
      totalNf: +getXmlNodeValue(x, "vNF"),
      protocoloAutorizacao: getXmlNodeValue(x, "nProt"),
      dataAutorizacao: moment(getXmlNodeValue(x, "dhRecbto")).format(
        "DD/MM/YYYY HH:mm:ss"
      ),
      dataSaida: moment(getXmlNodeValue(x, "dhSaiEnt").slice(0, 10)).format(
        "DD/MM/YYYY"
      ),
      horaSaida: moment(getXmlNodeValue(x, "dhSaiEnt")).format("HH:mm:ss"),
      emissor: {
        cnpj: getXmlNodeValue(x, "emit", "CNPJ"),
        razaosocial: getXmlNodeValue(x, "emit", "xNome"),
        endereco: getXmlNodeValue(x, "emit", "enderEmit", "xLgr"),
        num: getXmlNodeValue(x, "emit", "enderEmit", "nro"),
        complemento: getXmlNodeValue(x, "emit", "enderEmit", "xCpl"),
        bairro: getXmlNodeValue(x, "emit", "enderEmit", "xBairro"),
        cidade: getXmlNodeValue(x, "emit", "enderEmit", "xMun"),
        uf: getXmlNodeValue(x, "emit", "enderEmit", "UF"),
        cep: getXmlNodeValue(x, "emit", "enderEmit", "CEP"),
        pais: getXmlNodeValue(x, "emit", "enderEmit", "xPais"),
        fone: getXmlNodeValue(x, "emit", "enderEmit", "fone"),
        ie: getXmlNodeValue(x, "emit", "IE"),
        iest: getXmlNodeValue(x, "emit", "IEST"),
      },
      dest: {
        cpf: getXmlNodeValue(x, "dest", "CPF"),
        nome: getXmlNodeValue(x, "dest", "xNome"),
        endereco: getXmlNodeValue(x, "dest", "enderDest", "xLgr"),
        num: getXmlNodeValue(x, "dest", "enderDest", "nro"),
        complemento: getXmlNodeValue(x, "dest", "enderDest", "xCpl"),
        bairro: getXmlNodeValue(x, "dest", "enderDest", "xBairro"),
        cidade: getXmlNodeValue(x, "dest", "enderDest", "xMun"),
        uf: getXmlNodeValue(x, "dest", "enderDest", "UF"),
        cep: getXmlNodeValue(x, "dest", "enderDest", "CEP"),
        pais: getXmlNodeValue(x, "dest", "enderDest", "xPais"),
        fone: getXmlNodeValue(x, "dest", "enderDest", "fone"),
      },
      total: {
        baseIcms: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vBC")),
        icms: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vICMS")),
        bcst: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vBCST")),
        st: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vST")),
        pis: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vPIS")),
        ii: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vII")),
        totalProd: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vProd")),
        frete: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vFrete")),
        seguro: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vSeg")),
        desconto: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vDesc")),
        outros: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vOutro")),
        ipi: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vIPI")),
        cofins: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vCOFINS")),
        totalNF: toCurrency(+getXmlNodeValue(x, "total", "ICMSTot", "vNF")),
      },
      transp: {
        mod: getXmlNodeValue(x, "transp", "modFrete"),
        cnpj: getXmlNodeValue(x, "transp", "transporta", "CNPJ"),
        nome: getXmlNodeValue(x, "transp", "transporta", "xNome"),
        endereco: getXmlNodeValue(x, "transp", "transporta", "xEnder"),
        cidade: getXmlNodeValue(x, "transp", "transporta", "xMun"),
        uf: getXmlNodeValue(x, "transp", "transporta", "UF"),
        ie: getXmlNodeValue(x, "transp", "transporta", "IE"),
        placa: getXmlNodeValue(x, "transp", "veicTransp", "placa"),
        ufVeic: getXmlNodeValue(x, "transp", "veicTransp", "UF"),
        rntc: getXmlNodeValue(x, "transp", "veicTransp", "RNTC"),
      },
      volumes: {
        qtde: getXmlNodeValue(x, "transp", "vol", "qVol"),
        esp: getXmlNodeValue(x, "transp", "vol", "esp"),
        marca: getXmlNodeValue(x, "transp", "vol", "marca"),
        nVol: getXmlNodeValue(x, "transp", "vol", "nVol"),
        pesoL: getXmlNodeValue(x, "transp", "vol", "pesoL"),
        pesoB: getXmlNodeValue(x, "transp", "vol", "pesoB"),
      },
      info: {
        adic: getXmlNodeValue(x, "infAdic", "infCpl"),
        fisco: getXmlNodeValue(x, "infAdic", "infAdFisco"),
      },
      // itens: getProdutos(x).map(item => this.getXmlNodeValueProduct(item)),
    };

    return obj;
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(nfe, {
          "Content-Type": "application/xml; charset=utf-8",
        });

        const data = response.data;
        const nfData = parseNfeData(data);

        setNf(nfData);
      } catch (err) {}
    })();
  }, []);

  if (!nf) return "Pera ai";

  return (
    <>
      <div className="danfe-header-info no-print">
        <div className="flex-center">
          <div>
            <h4>Pedido</h4>
          </div>
        </div>
        <div className="flex-center">
          {!nf.chaveNfe && <h4>Nota Fiscal não encontrada</h4>}
        </div>
      </div>
      {nf.chaveNfe && (
        <div className="danfe-container">
          <div className="danfe-header">
            <div className="flex header-row1">
              <div className="cell middle center">
                <div className="bold">{nf.emissor.razaosocial}</div>
                <div className="small">
                  <div>{`${nf.emissor.endereco} ${nf.emissor.num} ${nf.emissor.complemento}`}</div>
                  <div>{`${nf.emissor.bairro}, ${nf.emissor.cidade}/${nf.emissor.uf} - ${nf.emissor.cep}`}</div>
                  <div>{`Telefone: ${nf.emissor.fone}`}</div>
                </div>
              </div>

              <div className="cell">
                <div className="center">
                  <div className="title bold">DANFE</div>
                  <div className="medium">
                    Documento Auxiliar da Nota Fiscal Eletrônica
                  </div>
                </div>
                <div className="flex around medium">
                  <div>
                    <div>
                      <b>0 - ENTRADA</b>
                    </div>
                    <div>
                      <b>1 - SAÍDA</b>
                    </div>
                  </div>
                  <div className="type-nf">{nf.tipoEmissao}</div>
                </div>
                <div className="flex around medium">
                  <div>Nº</div>
                  <div>
                    <b>{nf.nf}</b>
                  </div>
                </div>
                <div className="flex around medium">
                  <div>SÉRIE</div>
                  <div>
                    <b>{nf.serie}</b>
                  </div>
                </div>
                <div className="flex around medium">
                  <div>FL</div>
                  <div>
                    <b>1/1</b>
                  </div>
                </div>
              </div>

              <div className="cell">
                <div className="center">
                  <Barcode
                    {...{ width: 0.8, height: 30, displayValue: false }}
                    value={nf.chaveNfe}
                  />
                </div>
                <div className="center small">
                  <b>{nf.chaveNfe}</b>
                </div>
                <div className="center">
                  Consulta de autenticidade no portal nacional da NF-e
                  www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora
                </div>
              </div>
            </div>

            <div className="flex header-row2">
              <Cell label="NATUREZA DA OPERAÇÃO" value={nf.natureza} />
              <Cell
                label="PROTOCOLO DE AUTORIZAÇÃO DE USO"
                value={`${nf.protocoloAutorizacao} ${
                  moment(nf.dataAutorizacao).isValid() ? nf.dataAutorizacao : ""
                }`}
              />
            </div>
            <div className="flex header-row3">
              <Cell label="INSCRIÇÃO ESTADUAL" value={nf.emissor.ie} />
              <Cell
                label="INSCRIÇÃO ESTADUAL DO SUBST. TRIBUT."
                value={nf.emissor.iest}
              />
              <Cell label="CNPJ" value={nf.emissor.cnpj} />
            </div>
          </div>

          <div className="subheader">DESTINATÁRIO / REMETENTE</div>
          <div className="recipient">
            <div className="flex rec-row1">
              <Cell label="NOME / RAZÃO SOCIAL" value={nf.dest.nome} />
              <Cell label="CPF / CNPJ" value={nf.dest.cpf} />
              <Cell label="DATA DA EMISSÃO" value={nf.emissao} />
            </div>
            <div className="flex rec-row2">
              <Cell
                label="ENDEREÇO"
                value={`${nf.dest.endereco}, ${nf.dest.num} ${nf.dest.complemento}`}
              />
              <Cell label="BAIRRO / DISTRITO" value={nf.dest.bairro} />
              <Cell label="CEP" value={nf.dest.cep} />
              <Cell label="DATA DA SAÍDA" value={nf.dataSaida} />
            </div>
            <div className="flex rec-row3">
              <Cell label="MUNICÍPIO" value={nf.dest.cidade} />
              <Cell label="UF" value={nf.dest.uf} />
              <Cell label="FONE / FAX" value={nf.dest.fone} />
              <Cell label="INSCRIÇÃO ESTADUAL" value={null} />
              <Cell label="HORA DA SAÍDA" value={nf.horaSaida} />
            </div>
          </div>

          <div className="subheader">CÁLCULO DO IMPOSTO</div>
          <div className="tax-calc">
            <div className="flex tax-row">
              <Cell label="BASE DE CÁLCULO DO ICMS" value={nf.total.baseIcms} />
              <Cell label="VALOR DO ICMS" value={nf.total.icms} />
              <Cell label="BASE DE CÁLC. ICMS S.T." value={nf.total.bcst} />
              <Cell label="VALOR ICMS SUBST." value={nf.total.st} />
              <Cell label="VALOR IMP. IMPORTAÇÃO" value={nf.total.ii} />
              <Cell label="VALOR DO PIS" value={nf.total.pis} />
              <Cell
                label="VALOR TOTAL DOS PRODUTOS"
                value={nf.total.totalProd}
              />
            </div>
            <div className="flex tax-row">
              <Cell label="VALOR DO FRETE" value={nf.total.frete} />
              <Cell label="VALOR DO SEGURO" value={nf.total.seguro} />
              <Cell label="DESCONTO" value={nf.total.desconto} />
              <Cell label="OUTRAS DESPESAS" value={nf.total.outros} />
              <Cell label="VALOR TOTAL DO IPI" value={nf.total.ipi} />
              <Cell label="VALOR DA COFINS" value={nf.total.cofins} />
              <Cell label="VALOR TOTAL DA NOTA" value={nf.total.totalNF} />
            </div>
          </div>

          <div className="subheader">TRANSPORTADOR / VOLUMES TRANSPORTADOS</div>
          <div className="carrier">
            <div className="flex carrier-row1">
              <Cell label="NOME / RAZÃO SOCIAL" value={nf.transp.nome} />
              <Cell label="FRETE POR CONTA" value={nf.transp.mod} />
              <Cell label="CÓDIGO ANTT" value={nf.transp.rntc} />
              <Cell label="PLACA DO VEÍCULO" value={nf.transp.placa} />
              <Cell label="UF" value={nf.transp.ufVeic} />
              <Cell label="CNPJ / CPF" value={nf.transp.cnpj} />
            </div>
            <div className="flex carrier-row2">
              <Cell label="ENDEREÇO" value={nf.transp.endereco} />
              <Cell label="MUNICÍPIO" value={nf.transp.cidade} />
              <Cell label="UF" value={nf.transp.uf} />
              <Cell label="INSCRIÇÃO ESTADUAL" value={nf.transp.ie} />
            </div>
            <div className="flex carrier-row3">
              <Cell label="QUANTIDADE" value={nf.volumes.qtde} />
              <Cell label="ESPÉCIE" value={nf.volumes.esp} />
              <Cell label="MARCA" value={nf.volumes.marca} />
              <Cell label="NUMERAÇÃO" value={nf.volumes.nVol} />
              <Cell label="PESO BRUTO" value={nf.volumes.pesoB} />
              <Cell label="PESO LÍQUIDO" value={nf.volumes.pesoL} />
            </div>
          </div>

          <div className="subheader">DADOS DO PRODUTO / SERVIÇO</div>
          <div className="products">
            <table>
              <thead>
                <tr className="table-prod-header">
                  <td>CÓDIGO</td>
                  <td>DESCRIÇÃO DO PRODUTO / SERVIÇO</td>
                  <td>NCM/SH</td>
                  <td>CFOP</td>
                  <td>UN.</td>
                  <td>QUANT.</td>
                  <td>VALOR UNIT.</td>
                  <td>VALOR TOTAL</td>
                  <td>B. CÁLC. ICMS</td>
                  <td>VALOR ICMS</td>
                  <td>VALOR IPI</td>
                  <td>ALÍQ. ICMS</td>
                  <td>ALÍQ. IPI</td>
                </tr>
              </thead>
              <tbody>
                {/* {nf.itens.map((item, i) => (
                  <tr key={i}>
                    <td>{item.cProd}</td>
                    <td>{item.xProd}</td>
                    <td>{item.ncm}</td>
                    <td>{item.cfop}</td>
                    <td>{item.uCom}</td>
                    <td>{item.qCom}</td>
                    <td>{item.vUnCom}</td>
                    <td>{item.vProd}</td>
                    <td>{item.bcIcms}</td>
                    <td>{item.icms}</td>
                    <td>{null}</td>
                    <td>{item.aliqIcms}</td>
                    <td>{null}</td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>

          <div className="subheader">DADOS ADICIONAIS</div>
          <div className="additional-data">
            <div className="flex">
              <Cell label="INFORMAÇÕES COMPLEMENTARES" value={nf.info.adic} />
              <Cell
                label="RESERVADO AO FISCO"
                value={nf.info.fisco}
                innerHTML
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
