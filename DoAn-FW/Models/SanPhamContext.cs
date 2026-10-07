using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DoAn_FW.Models
{
    public class SanPhamContext
    {
        public string ConnectionString { get; set; }
        public SanPhamContext()
        {
            ConnectionString = DoAn_FW.Infrastructure.DbConfig.ConnectionString;
        }
        public SanPhamContext(string cs)
        {
            ConnectionString = cs;
        }
        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }
        //Tin Tức
        public List<object> ListSPMoiNhat()
        {
            List<object> list = new List<object >();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open(); ;
                var sql = " SELECT * FROM THONGTINSP ORDER BY MATTSP DESC LIMIT 24;";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
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
                            Ram = reader["Ram"].ToString(),
                            BoNhoTrong = reader["BoNhoTrong"].ToString(),
                            MauSac = reader["MauSac"].ToString(),
                            Gia = long.Parse(reader["Gia"].ToString()),
                            GiaKM = long.Parse(reader["GiaKM"].ToString())
                        }) ; 
                    }
                    reader.Close();
                }
                conn.Close();
            }
            return list;
        }

        public List<object> ListLoaiSP()
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open(); ;
                var sql = " SELECT * FROM LOAISP";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            MaLoaiSP = int.Parse(reader["MaLoaiSP"].ToString()),
                            TenLoaiSP = reader["TenLoaiSP"].ToString()
                        });
                    }
                    reader.Close();
                }
                conn.Close();
            }
            return list;
        }

        public List<object> ListHang()
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open(); ;
                var sql = "SELECT * FROM THUONGHIEU";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            MaTH = int.Parse(reader["MaTH"].ToString()),
                            TenTH = reader["TenTH"].ToString(),
                        });
                    }
                    reader.Close();
                }
                conn.Close();
            }
            return list;
        }

        public List<object> ListRam()
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open(); ;
                var sql = "SELECT * FROM THONGTINSP";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var ramValue = reader["Ram"].ToString();

                        // Kiểm tra giá trị Ram đã có trong list hay chưa
                        if (!list.Any(item => ((dynamic)item).Ram == ramValue))
                        {
                            list.Add(new
                            {
                                Ram = ramValue
                            });
                        }
                    }
                }
                conn.Close();
            }
            return list.OrderBy(item => Convert.ToInt32(((dynamic)item).Ram)).ToList();
        }

        public List<object> ListMemory()
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open(); ;
                var sql = " SELECT * FROM THONGTINSP";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var memoryValue = reader["BoNhoTrong"].ToString();

                        // Kiểm tra giá trị BoNhoTrong đã có trong list hay chưa
                        if (!list.Any(item => ((dynamic)item).BoNhoTrong == memoryValue))
                        {
                            list.Add(new
                            {
                                BoNhoTrong = memoryValue
                            });
                        }
                    }
                }
                conn.Close();
            }
            return list.OrderBy(item => Convert.ToInt32(((dynamic)item).BoNhoTrong)).ToList();
        }

        public List<object> ListManHinh()
        {
            List<object> list = new List<object>();
            list.Add(new { kichthuocmanhinh = "Dưới 6.5 inch" });
            list.Add(new { kichthuocmanhinh = "Trên 6.5 inch" });
            return list;
        }

        public List<object> FilterSanPham(int math, int currentProductId)
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                // Update the SQL query to filter by MaTH
                var sql = "SELECT * FROM THONGTINSP WHERE MaTH = @Math AND MaTTSP != @CurrentProductId";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaTH", math); // Add the parameter for filtering
                cmd.Parameters.AddWithValue("@CurrentProductId", currentProductId); // Exclude current product

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
                            SoLuong = int.Parse(reader["SoLuong"].ToString()),
                            Ram = reader["Ram"].ToString(),
                            BoNhoTrong = reader["BoNhoTrong"].ToString(),
                            MauSac = reader["MauSac"].ToString(),
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

        public object ChiTietSP(int mattsp)
        {
            object list = new object();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open(); ;
                var sql = "SELECT * FROM THONGTINSP t , LOAISP l, THUONGHIEU th WHERE t.MaLoaiSP = l.MaLoaiSP AND t.MaTH = TH.MaTH AND t.MaTTSP = @mattsp";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("mattsp", mattsp);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list = new
                        {
                            MaTTSP = int.Parse(reader["MaTTSP"].ToString()),
                            MaLoaiSP = int.Parse(reader["MaLoaiSP"].ToString()),
                            Gia = int.Parse(reader["Gia"].ToString()),
                            GiaKM = int.Parse(reader["GiaKM"].ToString()),
                            SoLuong = int.Parse(reader["SoLuong"].ToString()),
                            Mausac = reader["MauSac"].ToString(),
                            Ram = int.Parse(reader["Ram"].ToString()),
                            Bonhotrong = int.Parse(reader["BoNhoTrong"].ToString()),
                            Pin = int.Parse(reader["Pin"].ToString()),
                            Kichthuocmanhinh = float.Parse(reader["KichThuocManHinh"].ToString()),
                            Cameratruoc = reader["CameraTruoc"].ToString(),
                            Camerasau = reader["CameraSau"].ToString(),
                            Cpu = reader["CPU"].ToString(),
                            TenTH = reader["TenTH"].ToString(),
                            LoaiSP = reader["TenLoaiSP"].ToString(),
                            HinhAnh = reader["HinhAnh"].ToString(),
                            TenSP = reader["TenSP"].ToString(),
                        };
                    }
                    reader.Close();
                }
                conn.Close();
            }
            return list;
        }

        public string BuildFilterQuery(out List<MySqlParameter> parameters, List<string> MaLoaiSP, List<string> Ram, List<string> BoNhoTrong, List<string> ScreenSize, List<string> MaTH, string search, string sortOrder)
        {
            parameters = new List<MySqlParameter>();
            var query = new StringBuilder("SELECT * FROM thongtinsp WHERE 1=1");

            AppendFilter(query, parameters, "MaLoaiSP", MaLoaiSP);
            AppendFilter(query, parameters, "Ram", Ram);
            AppendFilter(query, parameters, "BoNhoTrong", BoNhoTrong);
            AppendFilterManHinh(query, parameters, ScreenSize);
            AppendFilter(query, parameters, "MaTH", MaTH);
            AppendFilterSearch(query, parameters, search);

            switch (sortOrder)
            {
                case "price_asc":
                    query.Append(" ORDER BY Gia ASC");
                    break;
                case "price_desc":
                    query.Append(" ORDER BY Gia DESC");
                    break;
                case "name_asc":
                    query.Append(" ORDER BY TenSP ASC");
                    break;
                case "name_desc":
                    query.Append(" ORDER BY TenSP DESC");
                    break;
                default:
                    break;
            }

            return query.ToString();
        }

        public void AppendFilter(StringBuilder query, List<MySqlParameter> parameters, string columnName, List<string> filterValues)
        {
            var validValues = filterValues?.Where(x => !string.IsNullOrWhiteSpace(x)).ToList();
            if (validValues != null && validValues.Count > 0)
            {
                query.Append($" AND {columnName} IN ({string.Join(", ", validValues.Select((x, i) => $"@{columnName}{i}"))})");
                parameters.AddRange(validValues.Select((x, i) => new MySqlParameter($"@{columnName}{i}", x)));
            }
        }

        public void AppendFilterManHinh(StringBuilder query, List<MySqlParameter> parameters, List<string> filterOptions)
        {
            if (filterOptions != null && filterOptions.Count > 0)
            {
                // Kiểm tra nếu tick "Dưới 6.5 inch"
                if (filterOptions.Contains("Dưới 6.5 inch"))
                {
                    query.Append(" AND kichthuocmanhinh < 6.5");
                }

                // Kiểm tra nếu tick "Trên 6.5 inch"
                if (filterOptions.Contains("Trên 6.5 inch"))
                {
                    query.Append(" AND kichthuocmanhinh > 6.5");
                }
            }
        }

        public void AppendFilterSearch(StringBuilder query, List<MySqlParameter> parameters, string filterInfor)
        {
            if (!string.IsNullOrWhiteSpace(filterInfor))
            {
                query.Append(" AND (TenSP LIKE @SearchKeyword OR MauSac LIKE @SearchKeyword OR CPU LIKE @SearchKeyword)");
                parameters.Add(new MySqlParameter("@SearchKeyword", $"%{filterInfor.Trim()}%"));
            }
        }

        public List<object> FetchFilteredProducts(string query, List<MySqlParameter> parameters)
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                using (var command = new MySqlCommand(query, conn))
                {
                    command.Parameters.AddRange(parameters.ToArray());
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new
                            {
                                MaTTSP = int.Parse(reader["MaTTSP"].ToString()),
                                MaLoaiSP = int.Parse(reader["MaLoaiSP"].ToString()),
                                Gia = long.Parse(reader["Gia"].ToString()),
                                GiaKM = long.Parse(reader["GiaKM"].ToString()),
                                SoLuong = int.Parse(reader["SoLuong"].ToString()),
                                MauSac = reader["MauSac"].ToString(),
                                Ram = int.Parse(reader["Ram"].ToString()),
                                BoNhoTrong = int.Parse(reader["BoNhoTrong"].ToString()),
                                Pin = int.Parse(reader["Pin"].ToString()),
                                kichthuocmanhinh = float.Parse(reader["kichThuocManHinh"].ToString()),
                                Cameratruoc = reader["CameraTruoc"].ToString(),
                                Camerasau = reader["CameraSau"].ToString(),
                                Cpu = reader["CPU"].ToString(),
                                MaTH = int.Parse(reader["MaTH"].ToString()),
                                HinhAnh = reader["HinhAnh"].ToString(),
                                TenSP = reader["TenSP"].ToString(),
                            });
                        }
                    }
                }
            }
            return list;
        }

        public List<object> BinhLuans(int mattsp)
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open(); ;
                var sql = "SELECT * FROM BINHLUAN b, KHACHHANG k WHERE b.MaKH = k.MaKH AND b.MaTTSP = @mattsp";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("mattsp", mattsp);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            TenKH = reader["TenKH"].ToString(),
                            NoiDung = reader["NoiDung"].ToString(),
                        });
                    }
                    reader.Close();
                }
                conn.Close();
            }
            return list;
        }

        public List<object> FilterSanPham()
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open(); 
                var sql = " SELECT * FROM THONGTINSP";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
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
                            SoLuong = int.Parse(reader["SoLuong"].ToString()),
                            Ram = reader["Ram"].ToString(),
                            BoNhoTrong = reader["BoNhoTrong"].ToString(),
                            MauSac = reader["MauSac"].ToString(),
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
        
        public List<object> SearchSP(string? search)
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                var sql = " SELECT * FROM THONGTINSP WHERE TenSP LIKE '%" + search + "%'";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("search", search);
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
                            Ram = int.Parse(reader["Ram"].ToString()),
                            BoNhoTrong = int.Parse(reader["BoNhoTrong"].ToString()),
                            MauSac = reader["MauSac"].ToString(),
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

        public List<object> ListHang(int maloaisp)
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open(); ;
                var sql = "SELECT th.MaTH, th.TenTH, COUNT(*) AS SL FROM thuonghieu th, thongtinsp t WHERE th.MaTH = t.MaTH AND t.MaLoaiSP = @maloaisp GROUP BY th.MaTH";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("maloaisp", maloaisp);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            MaTH = int.Parse(reader["MaTH"].ToString()),
                            TenTH = reader["TenTH"].ToString(),
                            SL = int.Parse(reader["SL"].ToString())
                        });
                    }
                    reader.Close();
                }
                conn.Close();
            }
            return list;
        }

        public List<object> FilterSanPham(int? maloaisp)
        {
            List<object> list = new List<object>();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                var sql = " SELECT * FROM THONGTINSP WHERE MaLoaiSP = @maloaisp";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("maloaisp", maloaisp);
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
                            SoLuong = int.Parse(reader["SoLuong"].ToString()),
                            Ram = reader["Ram"].ToString(),
                            BoNhoTrong = reader["BoNhoTrong"].ToString(),
                            MauSac = reader["MauSac"].ToString(),
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
    }
}

