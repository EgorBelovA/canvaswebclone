import Footer from './Footer';
import Header from './Header';

const TermsOfUse = () => {
  //   const termsofuse = [
  //     {
  //       title: 'Acceptance of Terms',
  //       text: 'By accessing or using this website, you agree to be bound by these Terms of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.',
  //     },
  //     {
  //       title: 'Use License',
  //       text: '',
  //     },
  //   ];
  return (
    <div className='index-container'>
      <div className='index-main'>
        <Header />
        <div
          style={{
            color: '#aaa',
            fontSize: '20px',
            fontFamily: 'Breath_Demo',
            margin: '20px',
            padding: '20px',
          }}
        >
          <h2>Terms of Use</h2>
          <br />
          <div>
            <strong>1. Acceptance of Terms</strong>
            <br />
            By accessing or using this website, you agree to be bound by these
            Terms of Use, all applicable laws and regulations, and agree that
            you are responsible for compliance with any applicable local laws.
            If you do not agree with any of these terms, you are prohibited from
            using or accessing this site. The materials contained in this
            website are protected by applicable copyright and trademark law.
          </div>
          <br />
          <div>
            <strong>2. Use License</strong>
            <br />
            Permission is granted to temporarily download one copy of the
            materials (information or software) on this website for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title, and under this license you may
            not:
            <ul>
              <li>&nbsp; - modify or copy the materials;</li>
              <li>
                &nbsp; - use the materials for any commercial purpose or for any
                public display;
              </li>
              <li>
                &nbsp; - attempt to decompile or reverse engineer any software
                contained on this website;
              </li>
              <li>
                &nbsp; - remove any copyright or other proprietary notations
                from the materials; or
              </li>
              <li>
                &nbsp; - transfer the materials to another person or "mirror"
                the materials on any other server.
              </li>
            </ul>
            <br />
            <div>
              This license shall automatically terminate if you violate any of
              these restrictions and may be terminated by the website owner at
              any time. Upon terminating your viewing of these materials or upon
              the termination of this license, you must destroy any downloaded
              materials in your possession whether in electronic or printed
              format.
            </div>
          </div>
          <br />
          <div>
            <strong>3. Disclaimer</strong>
            <br />
            <div>
              The materials on this website are provided on an 'as is' basis.
              The website owner makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </div>
            <br />
            <div>
              Further, the website owner does not warrant or make any
              representations concerning the accuracy, likely results, or
              reliability of the use of the materials on its website or
              otherwise relating to such materials or on any sites linked to
              this site.
            </div>
          </div>
          <br />
          <div>
            <strong>4. Limitations</strong>
            <br />
            <div>
              In no event shall the website owner be liable for any damages
              (including, without limitation, damages for loss of data or
              profit, or due to business interruption) arising out of the use or
              inability to use the materials on this website, even if the
              website owner has been notified orally or in writing of the
              possibility of such damage.
            </div>
          </div>
          <br />
          <div>
            <strong>5. Revisions and Errata</strong>
            <br />
            <div>
              The materials appearing on this website could include technical,
              typographical, or photographic errors. The website owner does not
              warrant that any of the materials on its site are accurate,
              complete, or current. The website owner may make changes to the
              materials contained on its website at any time without notice.
            </div>
          </div>
          <br />
          <div>
            <strong>6. Governing Law</strong>
            <br />
            <div>
              Any claim relating to this website shall be governed by the laws
              of [Your Jurisdiction] without regard to its conflict of law
              provisions.
            </div>
          </div>
          <br />
          <h3 style={{ textDecoration: 'underline' }}>
            By using this website, you agree to these Terms of Use and
            acknowledge that you have read and understood them.
          </h3>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TermsOfUse;
