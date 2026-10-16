/**
 * Sample repository ("shop-platform") used by the hero context-graph demo.
 * Coordinates live in a 720×450 viewBox, laid out left→right by layer:
 * clients → controllers → services → repositories/providers → models/infra.
 */

export type NodeKind = "client" | "controller" | "service" | "repository" | "model" | "infra";

export type GraphNode = { id: string; label: string; kind: NodeKind; x: number; y: number };
export type EdgeType = "CALLS" | "EXPOSES" | "IMPLEMENTS" | "REFERENCES" | "READS" | "WRITES" | "DEPENDS_ON";
export type GraphEdge = { from: string; to: string; type: EdgeType };

export const GRAPH_W = 720;
export const GRAPH_H = 450;

export const nodes: GraphNode[] = [
  { id: "checkout", label: "checkout.tsx", kind: "client", x: 62, y: 140 },
  { id: "admin", label: "admin.tsx", kind: "client", x: 62, y: 318 },
  { id: "orderCtl", label: "OrderController", kind: "controller", x: 196, y: 80 },
  { id: "payCtl", label: "PaymentController", kind: "controller", x: 204, y: 186 },
  { id: "adminCtl", label: "AdminController", kind: "controller", x: 190, y: 282 },
  { id: "userCtl", label: "UserController", kind: "controller", x: 200, y: 376 },
  { id: "orderSvc", label: "OrderService", kind: "service", x: 352, y: 118 },
  { id: "paySvc", label: "PaymentService", kind: "service", x: 370, y: 222 },
  { id: "notifySvc", label: "NotificationService", kind: "service", x: 346, y: 312 },
  { id: "userSvc", label: "UserService", kind: "service", x: 362, y: 392 },
  { id: "orderRepo", label: "OrderRepository", kind: "repository", x: 512, y: 64 },
  { id: "payRepo", label: "PaymentRepository", kind: "repository", x: 520, y: 158 },
  { id: "provider", label: "StripeProvider", kind: "service", x: 506, y: 246 },
  { id: "queue", label: "events.queue", kind: "infra", x: 522, y: 326 },
  { id: "userRepo", label: "UserRepository", kind: "repository", x: 510, y: 404 },
  { id: "order", label: "Order", kind: "model", x: 654, y: 98 },
  { id: "payment", label: "Payment", kind: "model", x: 662, y: 184 },
  { id: "mysql", label: "MySQL", kind: "infra", x: 652, y: 270 },
  { id: "redis", label: "Redis", kind: "infra", x: 664, y: 352 },
  { id: "user", label: "User", kind: "model", x: 650, y: 420 },
];

export const edges: GraphEdge[] = [
  { from: "checkout", to: "orderCtl", type: "EXPOSES" },
  { from: "checkout", to: "payCtl", type: "EXPOSES" },
  { from: "admin", to: "adminCtl", type: "EXPOSES" },
  { from: "admin", to: "userCtl", type: "EXPOSES" },
  { from: "orderCtl", to: "orderSvc", type: "CALLS" },
  { from: "adminCtl", to: "orderSvc", type: "CALLS" },
  { from: "payCtl", to: "paySvc", type: "CALLS" },
  { from: "userCtl", to: "userSvc", type: "CALLS" },
  { from: "orderSvc", to: "orderRepo", type: "CALLS" },
  { from: "orderSvc", to: "paySvc", type: "CALLS" },
  { from: "orderSvc", to: "notifySvc", type: "CALLS" },
  { from: "orderSvc", to: "userSvc", type: "CALLS" },
  { from: "paySvc", to: "payRepo", type: "CALLS" },
  { from: "paySvc", to: "provider", type: "DEPENDS_ON" },
  { from: "notifySvc", to: "queue", type: "WRITES" },
  { from: "userSvc", to: "userRepo", type: "CALLS" },
  { from: "userSvc", to: "redis", type: "READS" },
  { from: "orderRepo", to: "order", type: "REFERENCES" },
  { from: "payRepo", to: "payment", type: "REFERENCES" },
  { from: "userRepo", to: "user", type: "REFERENCES" },
  { from: "orderRepo", to: "mysql", type: "WRITES" },
  { from: "payRepo", to: "mysql", type: "WRITES" },
  { from: "userRepo", to: "mysql", type: "READS" },
];

export type ContextItem = { name: string; tokens: number };
export type ContextGroup = { label: string; items: ContextItem[] };

export type Focus = {
  symbol: string;
  target: string;
  nodes: string[];
  groups: ContextGroup[];
};

export const focuses: Focus[] = [
  {
    symbol: "OrderService.createOrder()",
    target: "orderSvc",
    nodes: ["orderSvc", "orderCtl", "adminCtl", "orderRepo", "paySvc", "notifySvc", "order", "mysql"],
    groups: [
      { label: "Target", items: [{ name: "OrderService.createOrder()", tokens: 412 }] },
      {
        label: "Callers",
        items: [
          { name: "OrderController.create()", tokens: 286 },
          { name: "AdminController.replay()", tokens: 198 },
        ],
      },
      {
        label: "Dependencies",
        items: [
          { name: "OrderRepository.save()", tokens: 244 },
          { name: "PaymentService.authorize()", tokens: 361 },
          { name: "NotificationService.orderPlaced()", tokens: 157 },
        ],
      },
      { label: "Models", items: [{ name: "Order · OrderLine", tokens: 530 }] },
      { label: "Tests", items: [{ name: "OrderServiceTest · 6 cases", tokens: 640 }] },
      { label: "Config", items: [{ name: "application.yml › orders.*", tokens: 92 }] },
      { label: "Recent changes", items: [{ name: "#482 split tax calculation", tokens: 318 }] },
    ],
  },
  {
    symbol: "PaymentService.processPayment()",
    target: "paySvc",
    nodes: ["paySvc", "payCtl", "orderSvc", "payRepo", "provider", "payment", "mysql", "checkout"],
    groups: [
      { label: "Target", items: [{ name: "PaymentService.processPayment()", tokens: 388 }] },
      {
        label: "Callers",
        items: [
          { name: "PaymentController.charge()", tokens: 241 },
          { name: "OrderService.createOrder()", tokens: 412 },
        ],
      },
      {
        label: "Dependencies",
        items: [
          { name: "PaymentRepository.record()", tokens: 205 },
          { name: "StripeProvider implements PaymentProvider", tokens: 476 },
        ],
      },
      { label: "Models", items: [{ name: "Payment · PaymentStatus", tokens: 312 }] },
      { label: "Tests", items: [{ name: "PaymentServiceTest · 9 cases", tokens: 702 }] },
      { label: "Config", items: [{ name: "payments.yml › provider, webhook", tokens: 118 }] },
      { label: "Recent changes", items: [{ name: "#517 idempotency keys", tokens: 264 }] },
    ],
  },
  {
    symbol: "UserService.findUser()",
    target: "userSvc",
    nodes: ["userSvc", "userCtl", "orderSvc", "userRepo", "redis", "user", "mysql", "admin"],
    groups: [
      { label: "Target", items: [{ name: "UserService.findUser()", tokens: 196 }] },
      {
        label: "Callers",
        items: [
          { name: "UserController.get()", tokens: 174 },
          { name: "OrderService.createOrder()", tokens: 412 },
        ],
      },
      {
        label: "Dependencies",
        items: [
          { name: "UserRepository.findById()", tokens: 133 },
          { name: "Redis · user:{id} cache", tokens: 88 },
        ],
      },
      { label: "Models", items: [{ name: "User · Role", tokens: 247 }] },
      { label: "Tests", items: [{ name: "UserServiceTest · 4 cases", tokens: 381 }] },
      { label: "Config", items: [{ name: "cache.yml › users.ttl", tokens: 41 }] },
      { label: "Recent changes", items: [{ name: "#503 cache user lookups", tokens: 229 }] },
    ],
  },
];

export const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, GraphNode>;

/** Horizontal bezier between layers; an outward arc for nodes in the same column. */
export function edgePath(a: GraphNode, b: GraphNode) {
  const dx = b.x - a.x;
  if (Math.abs(dx) < 40) {
    const bulge = 64;
    return `M ${a.x} ${a.y} C ${a.x + bulge} ${a.y}, ${b.x + bulge} ${b.y}, ${b.x} ${b.y}`;
  }
  const mx = a.x + dx / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

export function edgeMidpoint(a: GraphNode, b: GraphNode) {
  const sameColumn = Math.abs(b.x - a.x) < 40;
  return { x: (a.x + b.x) / 2 + (sameColumn ? 48 : 0), y: (a.y + b.y) / 2 };
}

export function neighborhood(id: string) {
  const set = new Set([id]);
  for (const e of edges) {
    if (e.from === id) set.add(e.to);
    if (e.to === id) set.add(e.from);
  }
  return set;
}

export function sumTokens(focus: Focus) {
  return focus.groups.reduce((acc, g) => acc + g.items.reduce((s, i) => s + i.tokens, 0), 0);
}
