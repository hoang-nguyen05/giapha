import '../../styles/parchment.css';

/**
 * Background using the user's provided reference image.
 */
export default function FamilyBackground() {
  return (
    <div className="parchment-bg" aria-hidden="true">
      <img src="/bg.jpg" alt="Background" className="bg-image" />
    </div>
  );
}
