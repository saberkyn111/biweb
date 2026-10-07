using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace DoAn_FW.Models
{
    public class DSSP_Mua
    {
        public string ConnectionString { get; set; }

        public DSSP_Mua()
        {
            ConnectionString = DoAn_FW.Infrastructure.DbConfig.ConnectionString;
        }

        public DSSP_Mua(string cs)
        {
            ConnectionString = cs;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }

        public int MaSPM { get; set; }
        public int MaHD { get; set; }
        public int MaKH { get; set; }
        public int MaTTSP { get; set; }
        public int SoLuong { get; set; }
        public int ThanhTien { get; set; }

        // Lấy danh sách các sản phẩm đã mua dựa trên MaHD
        public List<DSSP_Mua> ListDSSPMua(int makh)
        {
            List<DSSP_Mua> list = new List<DSSP_Mua>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                var sql = "SELECT * FROM dssanpham_mua WHERE MaKH = @makh";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("makh", makh);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new DSSP_Mua()
                        {
                            MaSPM = int.Parse(reader["MaSPM"].ToString()),
                            MaHD = int.Parse(reader["MaHD"].ToString()),
                            MaKH = int.Parse(reader["MaKH"].ToString()),
                            MaTTSP = int.Parse(reader["MaTTSP"].ToString()),
                            SoLuong = int.Parse(reader["SoLuong"].ToString()),
                            ThanhTien = int.Parse(reader["ThanhTien"].ToString())
                        });
                    }
                    reader.Close();
                }
                conn.Close();
            }
            return list;
        }

        public List<object> ListCTSPMua(int makh)
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                var sql = @"SELECT t.MaTTSP, t.MaLoaiSP , t.TenSP, t.HinhAnh, t.MauSac, t.Ram, t.BoNhoTrong, dsp.SoLuong, dsp.ThanhTien, t.Gia, t.GiaKM 
                            FROM dssanpham_mua dsp 
                            JOIN thongtinsp t ON dsp.MaTTSP = t.MaTTSP 
                            WHERE dsp.MaKH = @makh";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("makh", makh);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            MaTTSP = int.Parse(reader["MaTTSP"].ToString()),
                            MaLoaiSP = int.Parse(reader["MaLoaiSP"].ToString()),
                            TenSP = reader["TenSP"].ToString(),
                            HinhAnh = reader["HinhAnh"].ToString(),
                            MauSac = reader["MauSac"].ToString(),
                            Ram = int.Parse(reader["Ram"].ToString()),
                            BoNhoTrong = int.Parse(reader["BoNhoTrong"].ToString()),
                            SoLuong = int.Parse(reader["SoLuong"].ToString()),
                            ThanhTien = int.Parse(reader["ThanhTien"].ToString()),
                            Gia = long.Parse(reader["Gia"].ToString()),
                            GiaKM = long.Parse(reader["GiaKM"].ToString())
                        });
                    }
                    reader.Close();
                }
                conn.Close();
            }
            return list;
        }

        // Thêm sản phẩm vào DSSP_Mua
        public int InsertDSSPMua(DSSP_Mua dspmua)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                var sql = "INSERT INTO dssanpham_mua (MaHD, MaTTSP, SoLuong, ThanhTien) VALUES (@mahd, @mattsp, @soluong, @thanhtien)";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("mahd", dspmua.MaHD);
                cmd.Parameters.AddWithValue("mattsp", dspmua.MaTTSP);
                cmd.Parameters.AddWithValue("soluong", dspmua.SoLuong);
                cmd.Parameters.AddWithValue("thanhtien", dspmua.ThanhTien);

                return (cmd.ExecuteNonQuery());
            }
        }

        // Cập nhật thông tin sản phẩm đã mua
        public int UpdateDSSPMua(DSSP_Mua dspmua)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                var sql = "UPDATE dssanpham_mua SET SoLuong = @soluong, ThanhTien = @thanhtien WHERE MaHD = @mahd AND MaTTSP = @mattsp";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("mahd", dspmua.MaHD);
                cmd.Parameters.AddWithValue("mattsp", dspmua.MaTTSP);
                cmd.Parameters.AddWithValue("soluong", dspmua.SoLuong);
                cmd.Parameters.AddWithValue("thanhtien", dspmua.ThanhTien);

                return (cmd.ExecuteNonQuery());
            }
        }
    }
}

