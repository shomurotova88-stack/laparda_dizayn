import fs from 'fs';
import path from 'path';
import mediaManifest from '@/lib/media-manifest.json';

export interface UserRecord {
  id: string;
  phone: string;
  name: string;
  passwordHash: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  phone: string;
  serviceType: string;
  projectId?: string | null;
  projectTitle?: string | null;
  district?: string | null;
  address?: string | null;
  windowCount?: number | null;
  roomCount?: number | null;
  dimensions?: string | null;
  colorPreference?: string | null;
  fabricPreference?: string | null;
  budget?: string | null;
  measurementDate?: string | null;
  measurementTime?: string | null;
  comment?: string | null;
  photoUrls?: string | null;
  isWashingService?: boolean;
  washingCurtainQty?: number | null;
  washingNeedDismantle?: boolean;
  status: 'YANGI' | 'QABUL_QILINDI' | 'BOGLANILDI' | 'OLCHOV_BELGILANDI' | 'JARAYONDA' | 'TAYYOR' | 'BEKOR_QILINDI';
  telegramSent: boolean;
  telegramMessageId?: number | null;
  deliveryStatus: 'PENDING' | 'SENT' | 'FAILED';
  deliveryError?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  titleUz: string;
  titleRu: string;
  descriptionUz: string;
  descriptionRu: string;
  image: string;
  originalHeic?: string | null;
  video?: string | null;
  room: 'mehmonxona' | 'yotoqxona' | 'oshxona' | 'ofis';
  style: 'neoklassika' | 'modern' | 'minimalizm';
  hasBeforeAfter: boolean;
  featured: boolean;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface FavoriteRecord {
  id: string;
  userId: string;
  projectId: string;
  createdAt: string;
}

interface LocalStoreData {
  users: UserRecord[];
  orders: OrderRecord[];
  projects: ProjectRecord[];
  favorites: FavoriteRecord[];
  telegramLogs: Array<{
    id: string;
    orderId?: string;
    action: string;
    status: string;
    payload?: string;
    response?: string;
    createdAt: string;
  }>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

function initializeInitialProjects(): ProjectRecord[] {
  const manifestItems = mediaManifest?.pages?.projects?.items || [];
  return manifestItems.map((item, index) => {
    return {
      id: item.id || `proj-${index + 1}`,
      slug: `loyiha-${index + 1}`,
      titleUz: item.titleUz || `Parda loyihasi #${index + 1}`,
      titleRu: item.titleRu || `Проект штор #${index + 1}`,
      descriptionUz: `Toshkentdagi xonadon uchun maxsus tikilgan va o‘rnatilgan yuqori sifatli parda yechimi. Nozik matolar, aniq o‘lcham va mukammal taxlamlar.`,
      descriptionRu: `Индивидуальный пошив и установка штор для резиденции в Ташкенте. Премиальные ткани, идеальные складки и безупречный монтаж.`,
      image: item.image,
      originalHeic: item.originalHeic || null,
      video: item.video || null,
      room: (item.room as any) || 'mehmonxona',
      style: (item.style as any) || 'neoklassika',
      hasBeforeAfter: !!item.hasBeforeAfter,
      featured: index < 4,
      sortOrder: index,
      active: true,
      createdAt: new Date().toISOString()
    };
  });
}

function readStore(): LocalStoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: LocalStoreData = {
        users: [
          {
            id: 'admin-1',
            phone: '+998901234567',
            name: 'LA PARDA Administrator',
            // Default hash for 'admin12345'
            passwordHash: '$2a$10$wE1V.Fw9jFpA.E4r8uYQdOSX.F7jZsmb82w40Wn4P99yvK3W2u/u2',
            role: 'ADMIN',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        orders: [],
        projects: initializeInitialProjects(),
        favorites: [],
        telegramLogs: []
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading local store:', err);
    return {
      users: [],
      orders: [],
      projects: initializeInitialProjects(),
      favorites: [],
      telegramLogs: []
    };
  }
}

function writeStore(data: LocalStoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local store:', err);
  }
}

// Unified Database Provider
export const db = {
  // Users
  async findUserByPhone(phone: string): Promise<UserRecord | null> {
    const store = readStore();
    return store.users.find(u => u.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '')) || null;
  },

  async findUserById(id: string): Promise<UserRecord | null> {
    const store = readStore();
    return store.users.find(u => u.id === id) || null;
  },

  async createUser(user: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserRecord> {
    const store = readStore();
    const newUser: UserRecord = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.users.push(newUser);
    writeStore(store);
    return newUser;
  },

  // Orders
  async createOrder(orderData: Omit<OrderRecord, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<OrderRecord> {
    const store = readStore();
    const count = store.orders.length + 1;
    const year = new Date().getFullYear();
    const orderNumber = `LP-${year}-${String(count).padStart(4, '0')}`;

    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.orders.unshift(newOrder);
    writeStore(store);
    return newOrder;
  },

  async getAllOrders(): Promise<OrderRecord[]> {
    const store = readStore();
    return store.orders;
  },

  async getOrderById(id: string): Promise<OrderRecord | null> {
    const store = readStore();
    return store.orders.find(o => o.id === id || o.orderNumber === id) || null;
  },

  async getOrdersByUserId(userId: string): Promise<OrderRecord[]> {
    const store = readStore();
    return store.orders.filter(o => o.userId === userId);
  },

  async updateOrderStatus(
    idOrNumber: string,
    status: OrderRecord['status'],
    deliveryStatus?: OrderRecord['deliveryStatus'],
    deliveryError?: string | null
  ): Promise<OrderRecord | null> {
    const store = readStore();
    const order = store.orders.find(o => o.id === idOrNumber || o.orderNumber === idOrNumber);
    if (!order) return null;

    order.status = status;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (deliveryError !== undefined) order.deliveryError = deliveryError;
    order.updatedAt = new Date().toISOString();

    writeStore(store);
    return order;
  },

  async updateOrderDelivery(idOrNumber: string, status: 'SENT' | 'FAILED', messageId?: number, error?: string): Promise<void> {
    const store = readStore();
    const order = store.orders.find(o => o.id === idOrNumber || o.orderNumber === idOrNumber);
    if (order) {
      order.telegramSent = (status === 'SENT');
      order.deliveryStatus = status;
      if (messageId) order.telegramMessageId = messageId;
      if (error) order.deliveryError = error;
      order.updatedAt = new Date().toISOString();
      writeStore(store);
    }
  },

  // Projects
  async getAllProjects(): Promise<ProjectRecord[]> {
    const store = readStore();
    return store.projects.filter(p => p.active);
  },

  async getProjectById(id: string): Promise<ProjectRecord | null> {
    const store = readStore();
    return store.projects.find(p => p.id === id || p.slug === id) || null;
  },

  async createProject(project: Omit<ProjectRecord, 'id' | 'slug' | 'createdAt'>): Promise<ProjectRecord> {
    const store = readStore();
    const newProj: ProjectRecord = {
      ...project,
      id: `proj_${Date.now()}`,
      slug: `loyiha-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    store.projects.push(newProj);
    writeStore(store);
    return newProj;
  },

  async updateProject(id: string, updates: Partial<ProjectRecord>): Promise<ProjectRecord | null> {
    const store = readStore();
    const idx = store.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    store.projects[idx] = { ...store.projects[idx], ...updates };
    writeStore(store);
    return store.projects[idx];
  },

  async deleteProject(id: string): Promise<boolean> {
    const store = readStore();
    const initialLen = store.projects.length;
    store.projects = store.projects.filter(p => p.id !== id);
    if (store.projects.length !== initialLen) {
      writeStore(store);
      return true;
    }
    return false;
  },

  // Favorites
  async getFavorites(userId: string): Promise<ProjectRecord[]> {
    const store = readStore();
    const favIds = store.favorites.filter(f => f.userId === userId).map(f => f.projectId);
    return store.projects.filter(p => favIds.includes(p.id));
  },

  async toggleFavorite(userId: string, projectId: string): Promise<boolean> {
    const store = readStore();
    const idx = store.favorites.findIndex(f => f.userId === userId && f.projectId === projectId);
    let isFav = false;
    if (idx >= 0) {
      store.favorites.splice(idx, 1);
      isFav = false;
    } else {
      store.favorites.push({
        id: `fav_${Date.now()}`,
        userId,
        projectId,
        createdAt: new Date().toISOString()
      });
      isFav = true;
    }
    writeStore(store);
    return isFav;
  },

  // Telegram Logs
  async logTelegramAction(log: { orderId?: string; action: string; status: string; payload?: any; response?: any }): Promise<void> {
    const store = readStore();
    store.telegramLogs.unshift({
      id: `tlog_${Date.now()}`,
      orderId: log.orderId,
      action: log.action,
      status: log.status,
      payload: log.payload ? JSON.stringify(log.payload) : undefined,
      response: log.response ? JSON.stringify(log.response) : undefined,
      createdAt: new Date().toISOString()
    });
    // Keep max 100 logs
    if (store.telegramLogs.length > 100) {
      store.telegramLogs = store.telegramLogs.slice(0, 100);
    }
    writeStore(store);
  },

  async getTelegramLogs() {
    const store = readStore();
    return store.telegramLogs;
  }
};
