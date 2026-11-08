import { Arrow } from "../components/Footer";

export default function LegalPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="page legal">
      <div className="shell">
        <h1>Legal &amp; privacy</h1>
        <div className="legal__body">
          <p>
            This site is the portfolio of Rishi Thakor, an independent freelancer working across web development, app
            development, UI/UX design, graphic design and photography.
          </p>

          <h2>What is collected</h2>
          <p>
            Nothing, unless you allow it. If you accept the analytics prompt, Google Analytics sets cookies that count
            the visit and tell me which pages are being read. If you decline, no analytics cookies are set and the
            prompt does not return.
          </p>

          <h2>What is stored on your device</h2>
          <p>
            Only two preferences: whether you allowed analytics, and the light level you left the room in after
            pulling the cord. Both live in your browser's local storage and can be cleared at any time.
          </p>

          <h2>Email</h2>
          <p>
            If you write to rishithakor218@gmail.com, the message and whatever you choose to send with it is used to
            reply to you and nothing else.
          </p>

          <h2>Work shown here</h2>
          <p>
            Client work is shown with permission. Where a project belongs to an employer or a client, the company is
            named on the page. Photography of people is used with their consent.
          </p>
        </div>

        <button type="button" className="backpill" style={{ position: "static", marginTop: 40 }} onClick={() => onNavigate("/home")}>
          <Arrow up /> Back home
        </button>
      </div>
    </div>
  );
}
