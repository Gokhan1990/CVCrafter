import { useCV } from '../context/CVContext';

export default function Summary() {
  const { cvData, updateSummary } = useCV();

  return (
    <div className="section">
      <h3>Profesyonel Özet</h3>
      <div className="field fullWidth">
        <textarea
          rows="4"
          value={cvData.summary}
          onChange={e => updateSummary(e.target.value)}
          placeholder="Kendinizi kısaca tanıtın, kariyer hedeflerinizi ve güçlü yönlerinizi belirtin..."
        />
      </div>
    </div>
  );
}
