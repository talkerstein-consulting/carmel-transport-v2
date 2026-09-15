import type { LucideIcon } from "lucide-react"
import {
  Truck, MapPin, ShieldCheck, Headset, Snowflake, Wrench, Warehouse,
  Network, Gauge, Clock, Lock, Forklift, Thermometer,
} from "lucide-react"

/* Copy for the four service pages, supplied 2026-09-15. One table rather than
   four page files: every page is the same five movements in the same order, so
   the shape belongs in the template and only the words belong here. */

export type ServiceContent = {
  slug: string
  crumb: string
  /* masthead: head is inked, accent is the blue clause — the split-tone
     construction BRANDING §3 calls the signature move of the identity */
  head: string
  accent: string
  lead: string
  cover: string
  /* 01 — the problem this service solves */
  openHead: string
  openBody: string[]
  /* 02 — what is actually offered */
  offerHead: string
  /* Each offer card carries its own photograph. img is the rendered file;
     prompt is kept beside it so a re-roll does not need the prompt doc. */
  offer: { head: string; body: string; img: string; prompt: string }[]
  /* 03 — the chain, as a stepper. Each service has one; it is the shape of
     the service in four moves. */
  middle: { head: string; body: string[]; steps: { title: string; copy: string }[] }
  /* 04 — why Carmel. Icons are lucide, named here so the page stays data-driven. */
  why: { head: string; body: string; icon: LucideIcon }[]
  /* 05 — the close */
  closeHead: string
  closeBody: string[]
  closeCta: string
}

export const SERVICE_PAGES: ServiceContent[] = [
  {
    slug: "drayage",
    crumb: "Drayage",
    head: "Move freight forward.",
    accent: "Port to destination.",
    lead: "Carmel USA provides dependable, asset-based drayage for importers, exporters, brokers, and businesses moving containerized freight through the New York and New Jersey market.",
    cover: "/img/covers/drayage.jpg",
    openHead: "From the port to where it needs to be",
    openBody: [
      "Container transportation is often the most time-sensitive part of the supply chain. A missed appointment, equipment issue, or communication gap can quickly turn into additional costs.",
      "Carmel USA keeps that connection moving.",
      "Our team coordinates container pickup, transportation, and delivery with a focus on safety, timing, and clear communication. With company-owned equipment and a location close to major New Jersey ports, we are positioned to respond quickly when your freight is ready to move.",
    ],
    offerHead: "Built for everyday container movement",
    offer: [
      { head: "Import and export drayage", body: "Move containers between ports, terminals, rail facilities, warehouses, and final destinations with a carrier that understands the demands of container transportation.", img: "/img/services/cards/drayage-1.jpg", prompt: "Two brand new shipping containers being exchanged on a port apron, one lifting onto a gleaming new chassis by a reach stacker, the other already seated." },
      { head: "Port-to-destination delivery", body: "We handle the critical first and final miles between major terminals and your receiving location.", img: "/img/services/cards/drayage-2.jpg", prompt: "A brand new day-cab tractor and container chassis pulling away from a terminal gate down a freshly paved access road, open road ahead." },
      { head: "Specialized containers", body: "Our equipment supports a range of container types, including dry, overweight, refrigerated, open-top, and flat-rack containers.", img: "/img/services/cards/drayage-3.jpg", prompt: "Four brand new specialised containers square to camera: a standard dry, an open-top with its tarpaulin furled, a flat-rack, and a white refrigerated unit." },
      { head: "Full-service support", body: "From scheduling and dispatch to delivery coordination, our team stays involved throughout the move.", img: "/img/services/cards/drayage-4.jpg", prompt: "Close three-quarter detail of a brand new tractor cab and the head of its container chassis, king pin and air lines crisp and clean." },
    ],
    middle: {
      head: "How a container actually moves",
      body: [
        "Drayage looks like one trip and behaves like four. Each handoff has its own appointment, its own paperwork and its own way of going wrong.",
        "Carmel runs all four rather than handing you between providers at each edge.",
      ],
      steps: [
        { title: "Port", copy: "We take the appointment, clear the paperwork and pull the container off the terminal." },
        { title: "Pickup", copy: "Company-owned tractor and chassis, matched to the container type rather than to whatever is free." },
        { title: "Transport", copy: "Monitored on the road, with dispatch reachable the whole way." },
        { title: "Destination", copy: "Delivery coordinated against your receiving window, not just dropped at the gate." },
      ],
    },
    why: [
      { head: "Asset-based operations", body: "Our own tractors, chassis, and equipment give us greater control over availability and scheduling.", icon: Truck },
      { head: "Close to the ports", body: "Our Kearny, New Jersey location puts our operations near major New York and New Jersey port and terminal facilities.", icon: MapPin },
      { head: "Safety first", body: "Carmel maintains a strong focus on driver training, equipment maintenance, and safe cargo handling.", icon: ShieldCheck },
      { head: "24/7 support", body: "Our team is available around the clock to monitor shipments and respond when conditions change.", icon: Headset },
    ],
    closeHead: "Less uncertainty between port and destination.",
    closeBody: [
      "Your freight has already traveled thousands of miles before it reaches the port. The final leg should not be where things become complicated.",
      "Carmel helps keep your containers moving safely, efficiently, and predictably.",
    ],
    closeCta: "Get a drayage quote",
  },
  {
    slug: "refrigerated",
    crumb: "Refrigerated containers",
    head: "Keep temperature-sensitive freight moving.",
    accent: "Terminal to destination.",
    lead: "Carmel USA combines trained drivers, Genset chassis, and refrigerated container storage to help temperature-sensitive cargo move safely through the supply chain.",
    cover: "/img/covers/refrigerated.jpg",
    openHead: "When temperature matters, every mile matters",
    openBody: [
      "Refrigerated cargo requires more than a truck and a destination.",
      "It requires the right equipment, trained drivers, dependable coordination, and a place to keep containers when they cannot move immediately.",
      "Carmel provides an integrated solution for refrigerated container transportation and storage, helping customers manage temperature-sensitive freight from terminal to destination.",
    ],
    offerHead: "Refrigerated transportation, built around the load",
    offer: [
      { head: "Genset chassis", body: "Our fleet includes Genset-equipped chassis designed to support refrigerated container transportation.", img: "/img/services/cards/refrigerated-1.jpg", prompt: "Close detail of a spotless stainless steel Genset power pack on a brand new refrigerated container chassis, control panel and gauges crisp." },
      { head: "Trained drivers", body: "Our drivers are trained to handle refrigerated cargo and the operational requirements that come with it.", img: "/img/services/cards/refrigerated-2.jpg", prompt: "A brand new white refrigerated container seated on a Genset chassis at a clean yard bay, reefer plug connected, faint cold vapour at the vents." },
      { head: "Refrigerated storage", body: "Through Carmel USA Intermodal Logistics Inc., refrigerated containers can be stored securely when additional time is needed between transportation steps.", img: "/img/services/cards/refrigerated-3.jpg", prompt: "A row of brand new white refrigerated containers in a storage yard, each plugged into clean power posts, receding in perspective." },
      { head: "Up to 30 refrigerated containers", body: "Our storage facility is equipped to accommodate up to 30 refrigerated containers simultaneously.", img: "/img/services/cards/refrigerated-4.jpg", prompt: "Elevated wide of a refrigerated storage yard: roughly thirty brand new white reefer containers in neat ranks with power posts between them." },
    ],
    middle: {
      head: "A complete refrigerated solution",
      body: [
        "Keeping refrigerated freight moving often means coordinating several pieces at once.",
        "Carmel brings transportation and storage together so customers have fewer moving parts to manage.",
        "Our team works around the operational requirements of your shipment while keeping safety and reliability at the center of the process.",
      ],
      steps: [
        { title: "Terminal", copy: "We collect the reefer and get it plugged and monitored as quickly as the terminal allows." },
        { title: "Transportation", copy: "Genset chassis and drivers trained on refrigerated loads carry it from there." },
        { title: "Storage", copy: "If it cannot move on, it holds in our yard — up to 30 reefers at once, still powered." },
        { title: "Delivery", copy: "It leaves for its destination on your schedule rather than on the terminal's." },
      ],
    },
    why: [
      { head: "Specialized equipment", body: "Genset chassis help support the transportation requirements of refrigerated containers.", icon: Snowflake },
      { head: "Experienced operations", body: "Our team understands that temperature-sensitive freight requires additional attention throughout the move.", icon: Wrench },
      { head: "Strategic location", body: "Our New Jersey location provides convenient access to major port and terminal facilities.", icon: MapPin },
      { head: "Flexible storage", body: "When your cargo cannot move immediately, refrigerated storage provides another option without forcing the shipment into an unnecessary rush.", icon: Warehouse },
    ],
    closeHead: "Protect the cold chain from port to destination.",
    closeBody: [
      "Your cargo should not lose control of its environment just because it has reached the port.",
      "Carmel provides the transportation, equipment, and storage support needed to keep refrigerated containers moving.",
    ],
    closeCta: "Request refrigerated service",
  },
  {
    slug: "intermodal",
    crumb: "Intermodal trucking",
    head: "Connect ports, rail, and destination.",
    accent: "Every handoff on schedule.",
    lead: "Carmel USA connects ocean and rail terminals with the facilities and destinations that keep your supply chain moving.",
    cover: "/img/covers/intermodal.jpg",
    openHead: "One shipment. Multiple connections.",
    openBody: [
      "Modern freight rarely moves from one place directly to another.",
      "Containers move through ports, rail terminals, distribution centers, warehouses, and final destinations. Every handoff creates an opportunity for delays.",
      "Carmel helps manage the trucking portion of that journey. Our logistics team coordinates transportation around terminal requirements, rail schedules, delivery appointments, and the specific needs of each shipment.",
    ],
    offerHead: "Built around your network",
    offer: [
      { head: "Ocean terminal drayage", body: "Move containers between ocean terminals and warehouses, distribution centers, and other destinations.", img: "/img/services/cards/intermodal-1.jpg", prompt: "A brand new container chassis leaving an ocean terminal under ship-to-shore gantry cranes, the crane legs framing the exit lane." },
      { head: "Rail terminal transportation", body: "Coordinate the critical trucking connection between rail terminals and the next stage of your shipment.", img: "/img/services/cards/intermodal-2.jpg", prompt: "A brand new tractor and chassis alongside well-maintained intermodal rail cars stacked with immaculate containers, the rail line running away." },
      { head: "Container delivery", body: "Get freight where it needs to go with dependable transportation and delivery coordination.", img: "/img/services/cards/intermodal-3.jpg", prompt: "A brand new container chassis backing onto a clean distribution centre dock, dock doors and levellers crisp and new." },
      { head: "Shipment monitoring", body: "Our team keeps track of shipments and works proactively to address issues before they become larger problems.", img: "/img/services/cards/intermodal-4.jpg", prompt: "Wide elevated view of an intermodal yard at dusk, ordered rows of brand new containers and chassis lanes, discreet LED mast lighting." },
    ],
    middle: {
      head: "More control between every handoff",
      body: [
        "Intermodal transportation depends on timing.",
        "A container arriving at a terminal does not help if the next truck is not ready. A rail arrival does not mean much if the final delivery has not been coordinated.",
        "Carmel focuses on the connections between each stage. The goal is simple: keep the handoffs moving.",
      ],
      steps: [
        { title: "Port", copy: "Containers come off the ocean terminal against its appointment system." },
        { title: "Rail", copy: "We run the trucking leg into and out of the rail terminals either side." },
        { title: "Warehouse", copy: "Distribution centres and warehouses are booked in against their own windows." },
        { title: "Destination", copy: "The last leg is coordinated rather than assumed, which is where most delay is lost." },
      ],
    },
    why: [
      { head: "Strategic location", body: "Based in Kearny, New Jersey, Carmel operates close to major port and rail infrastructure.", icon: MapPin },
      { head: "Dedicated logistics support", body: "Our team manages the details behind each shipment so customers do not have to coordinate every movement themselves.", icon: Network },
      { head: "Flexible capacity", body: "Our broader network and equipment resources allow us to support different shipment requirements.", icon: Gauge },
      { head: "24/7 operations", body: "Freight does not stop moving after business hours. Neither does our support.", icon: Clock },
    ],
    closeHead: "Keep every connection on schedule.",
    closeBody: [
      "The strongest supply chains are not built around a single truck.",
      "They are built around reliable connections. Carmel helps make those connections work.",
    ],
    closeCta: "Plan your shipment",
  },
  {
    slug: "storage",
    crumb: "Storage facility",
    head: "Space when your freight needs it.",
    accent: "Secure, near the ports.",
    lead: "Carmel USA provides convenient, secure storage for dry and refrigerated containers, helping customers reduce unnecessary storage costs while keeping cargo close to the transportation network.",
    cover: "/img/covers/storage.jpg",
    openHead: "Storage should make logistics easier",
    openBody: [
      "Sometimes your container arrives before your warehouse is ready. Sometimes a delivery appointment changes. Sometimes you simply need more time between the port and the next step.",
      "Carmel provides a secure place to hold your containers without moving them farther away from the network.",
      "Our storage facility is strategically located near New Jersey ports and supported by company-owned tractors, lifting equipment, and a variety of chassis.",
    ],
    offerHead: "Secure storage for different container needs",
    offer: [
      { head: "Dry containers", body: "Storage solutions for standard dry containers when your freight needs additional time before delivery.", img: "/img/services/cards/storage-1.jpg", prompt: "Neat ranks of brand new dry shipping containers stacked two high in a clean storage yard, bright new line markings on fresh asphalt." },
      { head: "Refrigerated containers", body: "Dedicated capacity for refrigerated containers, supported by Carmel's refrigerated transportation capabilities.", img: "/img/services/cards/storage-2.jpg", prompt: "Brand new white refrigerated containers in a dedicated bay of a storage yard, plugged into clean power posts, dry containers behind." },
      { head: "Short- and long-term storage", body: "Keep containers on-site when schedules change or additional storage time is required.", img: "/img/services/cards/storage-3.jpg", prompt: "Wide of a container storage yard behind a clean palisade security fence with a modern camera mast, brand new containers in ordered rows." },
      { head: "Easy access to transportation", body: "Our location near major New Jersey ports helps reduce unnecessary repositioning when your container is ready to move.", img: "/img/services/cards/storage-4.jpg", prompt: "A brand new reach stacker lifting an immaculate container in a storage yard, a waiting tractor and chassis in the foreground." },
    ],
    middle: {
      head: "Storage and transportation under one roof",
      body: [
        "Your container is still your cargo. That means storage needs to provide more than an open yard — our facility is fully secured and monitored 24/7 to help protect containers while they are in our care.",
        "Storage becomes even more useful when it connects directly to transportation. Carmel can support the movement of your container before and after storage, helping reduce the number of separate providers involved in the process.",
        "One operation. Fewer handoffs.",
      ],
      steps: [
        { title: "Port", copy: "We collect from the terminal before demurrage starts building against you." },
        { title: "Storage", copy: "The container holds in a secured, 24/7-monitored yard minutes from the ports." },
        { title: "Delivery", copy: "When you are ready it leaves on our own equipment — no repositioning, no second carrier." },
      ],
    },
    why: [
      { head: "Near major NJ ports", body: "Strategic positioning helps keep stored containers close to the transportation network.", icon: MapPin },
      { head: "Secure facility", body: "24/7 surveillance helps protect your cargo while it is stored.", icon: Lock },
      { head: "Equipment on site", body: "Company-owned tractors, lifting equipment, and multiple chassis support efficient container handling.", icon: Forklift },
      { head: "Dry and refrigerated capability", body: "Storage options are available for different container requirements.", icon: Thermometer },
    ],
    closeHead: "Give your freight room to move.",
    closeBody: [
      "A changing schedule should not create unnecessary transportation costs.",
      "With secure storage near the ports, Carmel gives you another option when your freight is not ready for its next destination.",
    ],
    closeCta: "Request storage",
  },
]

export const SERVICE_BY_SLUG: Record<string, ServiceContent> = Object.fromEntries(
  SERVICE_PAGES.map((s) => [s.slug, s]),
)
