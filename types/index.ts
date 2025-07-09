export type Country = {
  id_negara: string;
  kode_negara: string;
  nama_negara: string;
};

export type Port = {
  id_pelabuhan: string;
  nama_pelabuhan: string;
};

export type Item = {
  id_barang: string;
  nama_barang: string;
  harga: number;
  diskon: number;
  description?: string;
};
