
import './ResultTable.css';

export function ResultTable({ results }) {

  if(Object.keys(results).length === 0) {
    return null;
  }

  return (
    <div className="result_table">
      <div className="result_item">
        <div className="result_title">
          Bottles arrived:
        </div>
        <div className="result_value">
          {results.arrivedOrders}
        </div>
      </div>

      <div className="result_item">
        <div className="result_title">
          Vaccines arrived:
        </div>
        <div className="result_value">
          {results.arrivedVaccines}
        </div>
      </div>

      <div className="result_item">
        <div className="result_title">
          Vaccines used:
        </div>
        <div className="result_value">
          {results.usedVaccines}
        </div>
      </div>

      <div className="result_item">
        <div className="result_title">
          Antiqua arrivals:
        </div>
        <div className="result_value">
          {results.arrivedOrdersPerProducer.Antiqua} bottles <br />
          {results.arrivedVaccinesPerProducer.Antiqua} vaccines
        </div>
      </div>

      <div className="result_item">
        <div className="result_title">
          SolarBuddhica arrivals:
        </div>
        <div className="result_value">
          {results.arrivedOrdersPerProducer.SolarBuddhica} bottles <br />
          {results.arrivedVaccinesPerProducer.SolarBuddhica} vaccines
        </div>
      </div>

      <div className="result_item">
        <div className="result_title">
          Zerpfy arrivals:
        </div>
        <div className="result_value">
          {results.arrivedOrdersPerProducer.Zerpfy} bottles <br />
          {results.arrivedVaccinesPerProducer.Zerpfy} vaccines
        </div>
      </div>

      <div className="result_item">
        <div className="result_title">
          Bottles expired:
        </div>
        <div className="result_value">
          {results.expiredBottles}
        </div>
      </div>

      <div className="result_item">
        <div className="result_title">
          Vaccines expired before usage:
        </div>
        <div className="result_value">
          {results.vaccinesExpiredBeforeUsage}
        </div>
      </div>

      <div className="result_item">
        <div className="result_title">
          Vaccines left to be used:
        </div>
        <div className="result_value">
          {results.validVaccinesLeft}
        </div>
      </div>

      <div className="result_item">
        <div className="result_title">
          Vaccines expiring in next 10 days:
        </div>
        <div className="result_value">
          {results.vaccinesExpiringInNext10days}
        </div>
      </div>

    </div>
  )
}
