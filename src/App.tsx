/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import APIs from "./services/APIs";
import { Port, Item, Country } from "../types";

export default function App() {
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [portList, setPortList] = useState<Port[]>([]);
  const [itemList, setItemList] = useState<Item[]>([]);

  const [loadingCountry, setLoadingCountry] = useState(true);
  const [loadingPort, setLoadingPort] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);

  const formik = useFormik({
    initialValues: {
      negara: "",
      pelabuhan: "",
      barang: "",
      discount: 0,
      harga: 0,
      total: 0,
      description: "",
    },

    onSubmit: (values) => {
      alert(`
      Form Submitted!

      Country     : ${values.negara}
      Port        : ${values.pelabuhan}
      Item        : ${values.barang}
      Description : ${values.description}
      Price       : Rp. ${values.harga.toLocaleString("id-ID")}
      Discount    : ${values.discount}%
      Total       : Rp. ${values.total.toLocaleString("id-ID")}
    `);
      formik.resetForm();
    },
  });

  const formatRupiah = (num: number) => `Rp. ${num.toLocaleString("id-ID")}`;
  const parseRupiah = (str: string) => Number(str.replace(/[^\d]/g, "") || "0");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountry(true);
        const res = await APIs.country();
        setCountryList(res.data);
      } catch (err) {
        console.error("Failed to fetch countries", err);
      } finally {
        setLoadingCountry(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const { harga, discount } = formik.values;
    formik.setFieldValue("total", harga * discount);
  }, [formik.values.harga, formik.values.discount]);

  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCountry = e.target.value;
    formik.setFieldValue("negara", selectedCountry);
    formik.setFieldValue("pelabuhan", "");
    formik.setFieldValue("barang", "");
    formik.setFieldValue("description", "");
    formik.setFieldValue("discount", "");
    formik.setFieldValue("harga", "");
    formik.setFieldValue("total", "");
    setPortList([]);
    setItemList([]);
    try {
      setLoadingPort(true);
      const params = {
        filter: JSON.stringify({ where: { id_negara: selectedCountry } }),
      };
      const res = await APIs.getPortsByCountry(params);
      setPortList(res.data);
    } catch (err) {
      console.error("Failed to load ports", err);
    } finally {
      setLoadingPort(false);
    }
  };

  const handlePortChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPort = e.target.value;
    formik.setFieldValue("pelabuhan", selectedPort);
    formik.setFieldValue("barang", "");
    formik.setFieldValue("description", "");
    formik.setFieldValue("discount", "");
    formik.setFieldValue("harga", "");
    formik.setFieldValue("total", "");
    setItemList([]);
    try {
      setLoadingItem(true);
      const params = {
        filter: JSON.stringify({ where: { id_pelabuhan: selectedPort } }),
      };
      const res = await APIs.getItemsByPort(params);
      setItemList(res.data);
    } catch (err) {
      console.error("Failed to load items", err);
    } finally {
      setLoadingItem(false);
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedItem = e.target.value;
    formik.setFieldValue("barang", selectedItem);
    const found = itemList.find((b) => b.id_barang.toString() === selectedItem);

    if (found) {
      formik.setFieldValue("harga", found.harga);
      formik.setFieldValue("discount", found.diskon);
      formik.setFieldValue("description", found.description || "");
    } else {
      formik.setFieldValue("harga", 0);
      formik.setFieldValue("discount", 0);
      formik.setFieldValue("description", "");
    }
  };

  const Skeleton = () => (
    <div className="animate-pulse h-10 bg-gray-200 rounded w-full" />
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-xl p-6 bg-white rounded-2xl shadow-lg space-y-5"
      >
        <div>
          <label className="block mb-1 font-semibold">Country</label>
          {loadingCountry ? (
            <Skeleton />
          ) : (
            <select
              name="negara"
              required
              onChange={handleCountryChange}
              value={formik.values.negara}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Country</option>
              {countryList.map((n) => (
                <option key={n.id_negara} value={n.id_negara}>
                  {n.kode_negara} - {n.nama_negara}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Port</label>
          {loadingPort ? (
            <Skeleton />
          ) : (
            <select
              name="pelabuhan"
              required
              onChange={handlePortChange}
              value={formik.values.pelabuhan}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Port</option>
              {portList.map((p) => (
                <option key={p.id_pelabuhan} value={p.id_pelabuhan}>
                  {p.nama_pelabuhan}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Item</label>
          {loadingItem ? (
            <Skeleton />
          ) : (
            <select
              name="barang"
              required
              onChange={handleItemChange}
              value={formik.values.barang}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Item</option>
              {itemList.map((b) => (
                <option key={b.id_barang} value={b.id_barang}>
                  {b.id_barang} - {b.nama_barang}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            required
            name="description"
            value={formik.values.description}
            readOnly
            className="w-full border p-2 h-24 bg-gray-100 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Discount</label>
            <input
              required
              type="number"
              name="discount"
              value={formik.values.discount}
              onChange={formik.handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Price</label>
            <input
              required
              type="number"
              name="harga"
              value={formik.values.harga}
              onChange={formik.handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Total</label>
          <input
            required
            type="text"
            name="total"
            value={formatRupiah(formik.values.total)}
            onChange={(e) => {
              const raw = parseRupiah(e.target.value);
              formik.setFieldValue("total", raw);
            }}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
