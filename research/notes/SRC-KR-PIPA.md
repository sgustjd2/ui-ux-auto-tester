# SRC-KR-PIPA — Personal Information Protection Act (개인정보 보호법)

- Authority: Republic of Korea, National Assembly (statute). Responsible ministry (소관부처) as printed: Personal Information Protection Commission (개인정보보호위원회, PIPC). Published by the National Law Information Center (국가법령정보센터, law.go.kr), Ministry of Government Legislation.
- Canonical URL: https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=283839 (this version). Stable current-version address: https://www.law.go.kr/법령/개인정보보호법. Law ID 011357; version serial (MST/lsiSeq) 283839. The web pages load the metadata, but the article bodies are rendered by JavaScript (GAP-033). The article text was read through law.go.kr's own open API (DRF), `https://www.law.go.kr/DRF/lawService.do?target=law&MST=283839&type=XML&JO=<article>`. This used the public `OC=test` key.
- Version / date: Act No. 21445 (법률 제21445호), a partial amendment (일부개정) promulgated 10 March 2026 and effective 11 September 2026. The lsInfoP page header and the DRF metadata agree on this. The DRF effective-date search lists it as 현행 (current) on 2026-09-23.
- Source status: CURRENT
- Superseded by / supersedes: not superseded. Two versions are scheduled but not yet in force (시행예정). First, part of Act No. 21445 takes effect 1 July 2027. Second, Act No. 21910 was promulgated 8 September 2026 and takes effect 9 March 2027 (MST 289415). Both are listed in the history below. When Act No. 21910 takes effect on 9 March 2027, the lead must re-verify this row.
- License / access: The Act is a Korean statute and public. Statutes are not protected works under Copyright Act Art. 7 subpara. 1 (저작권법 제7조 제1호). I read that article at law.go.kr, Copyright Act MST 283335, effective 11 August 2026. Project policy (research plan §7) still stores paraphrases only. The KLRI English translation (elaw.klri.re.kr, hseq=62389) says it is "for reference only, and are neither official nor legally effective". I did not confirm which amendment it reflects.
- Verified on: 2026-09-23
- Tier: T1
- Domains served: OTH-PRIVACY-UX, OTH-CONSENT-UX

## Version history relevant to consent UX (from the law.go.kr DRF effective-date list, 2026-09-23)

| Act No. | Promulgated | Effective | Relevance (as read) |
|---|---|---|---|
| 16930 | 2020-02-04 | 2020-08-05 | The last version before 2023. I read it for comparison (MST 213857). |
| 19234 | 2023-03-14 | 2023-09-15. Arts. 11-2, 31, 35-3, 37-2 and 39-7 took effect 2024-03-15. The list also shows a third effective date, 2025-03-13; I did not confirm which provisions it covers. | The major consent revision (details below). |
| 20897 | 2025-04-01 | 2025-10-02 | Domestic representatives of processors without a Korean address (per the law.go.kr reasons page). Arts. 15, 22, 30, 37 and 38 show no 2025 amendment notes. |
| 21445 | 2026-03-10 | 2026-09-11. Per a tool summary, Art. 32-2(1) proviso and Art. 75(2)15 take effect 2027-07-01; not read verbatim. | A response to large-scale breaches (reasons page). The notes on Arts. 15, 22, 30, 37 and 38 carry no 2026 date. |
| 21910 | 2026-09-08 | 2027-03-09 (scheduled) | Use of lawfully collected personal information for AI technology development, subject to PIPC deliberation (reasons page). In this version, I checked Arts. 15, 22, 30, 37 and 38 one by one: each returns 조문변경여부 N, with no 2026 notes. |

What Act No. 19234 changed for consent. I compared the 2020 and current texts and read the law.go.kr amendment-reasons page, items 라 and 차:

- Art. 15(1)4: the contract basis used to require that processing be "unavoidably necessary" for concluding or performing a contract. It now requires only that processing be necessary to perform a contract, or to take steps the data subject requests while a contract is being concluded.
- Art. 22(3): the pre-2023 text required separating, at the moment of consent, the information processable without consent (for example, for a contract) from the information that needs consent. The processor carried the burden of proof. The current text instead requires items processed without consent, and their legal basis, to be disclosed separately from consent-based items. The burden of proof stays with the processor.
- The pre-2023 Art. 22(4) (the marketing-consent notice) became Art. 22(1) item 7. The pre-2023 Art. 22(6) (children under 14) became the new Art. 22-2.
- Chapter 6, the special rules for information and communications service providers, was deleted ("제6장 삭제 <2023.3.14>"). The online-only consent rule in the former Art. 39-3 went with it, and online and offline processors now follow the same rules. The current Art. 39-3 is an unrelated article on submission of materials.
- PIPC press release of 12 September 2024 (pipc.go.kr nttId=10566, also on korea.kr): personal information needed for a service contract can be processed without consent, which ends the practice of "required consent" (필수동의). Consent principles in Enforcement Decree Art. 17(1) took effect 15 September 2024. The release said a 개인정보 처리 통합 안내서 (integrated processing guide) would follow by year-end. This is T2 context only; I did not read the Decree.

## Scope and applicability

- Binds every personal information controller (개인정보처리자, Art. 2 subpara. 5): public institutions, corporations, organisations and individuals that process personal information, themselves or through others, to operate personal information files for their work. Since 2023 the same rules apply online and offline.
- Protected: the data subject (정보주체, Art. 2 subpara. 3), meaning living individuals identifiable from the information (Art. 2 subpara. 1).
- Jurisdiction: KR. Rule class LEGAL. It does not incorporate any technical UI standard by reference. Details are delegated to the Enforcement Decree (대통령령) and to PIPC notices (고시).
- Not read this session: territorial reach over foreign services and the general applicability articles (see uncertainties).

## Structure

- Identifiers: Article 제N조; branch article 제N조의M (Art. N-M); paragraph 항 (①, ②, ...); subparagraph 호 (1., 2., ...). Each provision carries its amendment history in brackets (<개정 YYYY.M.D>, <신설 ...>, 삭제 <...>, [본조신설 ...], [전문개정 ...]).
- Normative status: the whole Act is binding. Many articles delegate "detailed methods" to the Enforcement Decree and "display methods" to PIPC notices. Both are binding subordinate instruments, but each is a separate document with its own version (candidates below). PIPC guides (안내서) interpret the law. I expect them to be informative, not binding (unconfirmed).
- I did not extract the full chapter list this session. The only chapter fact confirmed is that Chapter 6 was deleted in 2023.

Articles read (current version, Act No. 21445; paraphrased):

- Art. 2: definitions of personal information, processing, data subject and controller.
- Art. 15 (collection and use): para. 1 lists seven lawful bases, the first being the data subject's consent. Para. 2: when obtaining consent, the controller must inform the data subject of four things. These are the purpose, the items collected, the retention and use period, and the right to refuse together with any disadvantage of refusing. Changing any of them requires new notice and new consent. Para. 3: use without consent within a scope reasonably related to the original purpose, per the Decree.
- Art. 17(2) (third-party provision): consent must state five things. These are the recipient, the recipient's purpose, the items, the recipient's retention period, and the right to refuse with any disadvantage.
- Art. 22 (methods of obtaining consent):
  - Para. 1: separate each consent matter and inform the data subject so they clearly recognise it. The legal representative under Art. 22-2 counts as the data subject here. Separate consent is required for each of: Art. 15(1)1, Art. 17(1)1, Art. 18(2)1, Art. 19 item 1, Art. 23(1)1, Art. 24(1)1, marketing or sales solicitation (item 7), and cases set by the Decree (item 8).
  - Para. 2: consent in writing, including electronic documents, must clearly display the important matters set by the Decree (for example purpose and items). The display must follow the method in a PIPC notice and be easy to read.
  - Para. 3: items processed without consent, and their legal basis, must be disclosed separately from consent-based items. Disclosure is through the privacy policy under Art. 30(2) or by notice such as email.
  - Paras. 4 and 6: deleted in 2023.
  - Para. 5: the controller must not refuse goods or services because the data subject declines optional items, or declines consent under item 3 (Art. 18(2)1) or item 7 (marketing).
  - Para. 7: further details are delegated to the Decree, taking the collection medium into account.
- Art. 22-2 (children, new in 2023): for a child under 14, obtain consent from the legal representative and confirm that they consented (para. 1). The minimum information needed to reach the representative may be collected from the child (para. 2). Notices to children under 14 must use an easy-to-understand format and clear, plain language (para. 3).
- Art. 23(3) (new in 2023): if providing the service risks exposing sensitive information, tell the data subject before providing it, in an easily recognisable way. The notice covers the exposure possibility and how to choose non-disclosure.
- Art. 30 (privacy policy, 개인정보 처리방침): para. 1 lists the mandatory contents. These are purposes; retention; third-party provision; destruction; the sensitive-information non-disclosure option; outsourcing; pseudonymised information; data-subject rights; privacy officer contact; operation of automatic collection devices; and Decree items. Para. 2: disclose the policy so data subjects can easily check it, using the method set by the Decree. Para. 3: if the policy and a contract conflict, the version more favourable to the data subject applies. Para. 4: PIPC may issue writing guidelines. The tool returned Art. 30 as an English paraphrase, not verbatim.
- Art. 37 (suspension of processing and withdrawal of consent): the data subject may request suspension or withdraw consent (para. 1). The controller must comply without delay, subject to listed exceptions (para. 2). After withdrawal, the controller must destroy the information without delay unless an exception applies (para. 3, new in 2023). If the controller refuses a request or relies on an exception, it must notify the data subject without delay (para. 4). Procedures are set by the Decree (para. 6). The tool returned Art. 37 as an English paraphrase, not verbatim.
- Art. 38 (method of exercising rights): requests to access, transmit, correct, delete, suspend, withdraw consent, or refuse or seek explanation of automated decisions may be made through an agent (para. 1). The legal representative of a child under 14 may make them (para. 2). The controller must set concrete methods and procedures for these requests and publish them so data subjects can know them (para. 4). It must also set up and explain an objection procedure against refusals (para. 5).

## Candidate rules

Proposed prefix: `KRPIPA`. It is not registered in `docs/rule-schema.md` §8; that is a lead decision. All rules are class LEGAL, jurisdiction KR, source version Act No. 21445. They apply when the product's operator is a controller subject to the Act. Testability is given as automated / visual / manual.

- KRPIPA-art-15-2-001 (Art. 15(2)): a consent request for collection or use shows the purpose, the items, the retention period, and the right to refuse with any disadvantage. Changing any of these triggers new notice and consent. MUST. Testability PARTIAL / FULL / FULL: text presence can be detected, but a person must judge adequacy.
- KRPIPA-art-17-2-001 (Art. 17(2)): a consent request for third-party provision shows the recipient, the recipient's purpose, the items, the recipient's retention period, and the right to refuse. MUST. PARTIAL / FULL / FULL.
- KRPIPA-art-22-1-001 (Art. 22(1)): consent matters are presented separately and recognisably. Collection, provision, beyond-purpose use, sensitive data, unique identifiers and marketing each get their own consent, with no single bundled consent. MUST. PARTIAL (DOM: separate controls per matter) / FULL / FULL.
- KRPIPA-art-22-1-7-001 (Art. 22(1)7): marketing or sales-solicitation consent is a distinct consent. MUST. PARTIAL / FULL / FULL.
- KRPIPA-art-22-2-001 (Art. 22(2)): in written or electronic consent, the important matters are clearly displayed and easy to read, as the PIPC notice specifies. MUST. Testability depends on the notice's display criteria, which are unverified. PARTIAL / FULL / FULL.
- KRPIPA-art-22-3-001 (Art. 22(3)): items processed without consent, with their legal basis, are presented apart from consent-based items. The channel is the privacy policy or a notice. MUST. NONE / PARTIAL / FULL.
- KRPIPA-art-22-5-001 (Art. 22(5)): declining optional consent, beyond-purpose consent, or marketing consent does not block the service. MUST (prohibition). PARTIAL / NONE / FULL. A flow test can decline the optional items and confirm the user can continue.
- KRPIPA-art-22-2-1-001 (Art. 22-2(1)): a flow that collects data from children under 14 obtains and confirms the legal representative's consent. MUST. NONE / NONE / FULL (flow review).
- KRPIPA-art-22-2-3-001 (Art. 22-2(3)): privacy notices aimed at children under 14 use an easy format and plain, clear language. MUST. NONE / PARTIAL / FULL. It can pair with a readability heuristic, but readability is not a legal threshold.
- KRPIPA-art-23-3-001 (Art. 23(3)): where a service may expose sensitive data, the user is told beforehand, in an easily recognisable way, about the exposure possibility and how to choose non-disclosure. MUST. NONE / PARTIAL / FULL.
- KRPIPA-art-30-1-001 (Art. 30(1)): the privacy policy contains the mandatory items. MUST. PARTIAL (section detection) / NONE / FULL.
- KRPIPA-art-30-2-001 (Art. 30(2)): the privacy policy is published so data subjects can check it easily. The display method is in the Decree (unverified). MUST. PARTIAL (link presence) / FULL / FULL.
- KRPIPA-art-37-1-001 (Art. 37(1) with Art. 38(4)): the product offers a findable way to withdraw consent and to request suspension, and it publishes the procedure. MUST. PARTIAL / PARTIAL / FULL.
- KRPIPA-art-37-4-001 (Art. 37(4)): when the controller refuses a request or relies on an exception, the user is notified without delay. MUST. NONE / NONE / FULL. This is a process check and mostly outside UI evidence.
- KRPIPA-art-38-4-001 (Art. 38(4)): concrete methods and procedures for access, correction, deletion, transmission, suspension, withdrawal and automated-decision requests exist and are published. MUST. PARTIAL / PARTIAL / FULL.
- KRPIPA-art-38-5-001 (Art. 38(5)): an objection procedure against refusals exists and is explained. MUST. NONE / PARTIAL / FULL.
- Not a UI rule: Art. 37(3), destruction after withdrawal, is a back-end duty. Record it only as context for KRPIPA-art-37-1-001.

## Cross-references

- Enforcement Decree (개인정보 보호법 시행령), Presidential Decree No. 36671, promulgated 10 September 2026 and effective 11 September 2026 (DRF metadata only; MST 289537). It holds the details delegated by Arts. 22(2), 22(7), 22-2(4), 30(2), 37(6) and 38, including the Art. 17(1) consent principles cited by PIPC. Candidate source SRC-KR-PIPA-DECREE; not researched.
- PIPC notice 개인정보 처리 방법에 관한 고시, PIPC Notice No. 2026-10, issued and effective 20 August 2026 (DRF admrul metadata only). This is the display-method notice named in Art. 22(2). Candidate source; not researched.
- PIPC guidance: 개인정보 처리 통합 안내서, announced 12 September 2024, and 알기 쉬운 개인정보 처리 동의 안내서. These are UI-level T2 guidance candidates. I have not verified their editions, dates, or whether one supersedes the other.
- 표준 개인정보 보호지침 (a PIPC administrative rule) appeared in search results. It is a candidate only.
- SRC-EU-GDPR and SRC-EDPB-CONSENT: EU counterparts for the consent crosswalk (both CANDIDATE). The crosswalk should be `related`, not `equivalent`, until both are read.
- SRC-KR-ECOMMERCE-ACT: a neighbouring Korean source for deceptive patterns (OTH-DARK-PATTERNS).

## Uncertainties and gaps

- Access: law.go.kr article bodies are still JavaScript-rendered, but its official DRF open API returns article XML. I used the shared `OC=test` key. The terms for using that key, versus registering a project key, are unconfirmed. This affects GAP-033 and the other Korean statutes.
- Fidelity: the fetch tool returned Arts. 15, 22, 22-2, 23 and 38 largely as quotations, but Arts. 30 and 37 only as English paraphrases. Re-read Arts. 30 and 37 verbatim before Phase 2 normalization.
- A first tool summary of Act No. 21910 wrongly claimed changes to Arts. 15, 22, 30, 37 and 38. The per-article checks (조문변경여부 N, no 2026 notes) and the reasons page contradict it. I relied on the per-article evidence.
- Not confirmed: which provisions of Act No. 19234 took effect on 2025-03-13, and the exact provisions of Act No. 21445 deferred to 2027-07-01.
- The brief's description of Art. 22 as "separating required vs optional consent" matches the pre-2023 Art. 22(3), not the current text. The current Act separates consent-free items from consent-based ones and protects optional refusals. PIPC treats the move away from "required consent" as practice guidance and Decree content. Phase 2 rules must cite the current wording.
- Open questions: does an "agree to all" control next to individual items satisfy Art. 22(1)? Is withdrawal required to be as easy as giving consent? The Act text I read does not settle either. Check the Decree and PIPC guidance.
- Not read: territorial scope and applicability to foreign operators, including the domestic-representative duty in Art. 31-2. This relates to GAP-010.
- Prefix `KRPIPA` is a proposal. The existing `KRLAW` prefix is bound to SRC-KR-DISABILITY-ACT despite its generic name.
- No fetched page contained text addressed to an agent or asking for actions.
