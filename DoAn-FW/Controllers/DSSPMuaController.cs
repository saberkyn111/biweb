using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using DoAn_FW.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Web_ProjectFrameWork.Controllers
{
    public class DSSPMuaController : Controller
    {
        public KhachHang DataKH()
        {
            var KH = new KhachHang();
            if (HttpContext.Session.GetString("KH") != null)
            {
                KH = JsonConvert.DeserializeObject<KhachHang>(HttpContext.Session.GetString("KH"));
            }
            this.ViewBag.KH = KH;
            return KH;
        }
        public void DataCart()
        {
            var KH = new KhachHang();
            if (HttpContext.Session.GetString("KH") != null)
            {
                KH = JsonConvert.DeserializeObject<KhachHang>(HttpContext.Session.GetString("KH"));
            }
            var context = new GioHang();
            var cart = context.ListGioHang(KH.MaKH);
            this.ViewBag.cart = cart;
        }
        public void DataDSSPMua()
        {
            var KH = new KhachHang();
            if (HttpContext.Session.GetString("KH") != null)
            {
                KH = JsonConvert.DeserializeObject<KhachHang>(HttpContext.Session.GetString("KH"));
            }
            var context = new DSSP_Mua();
            var dssp_mua = context.ListDSSPMua(KH.MaKH);
            this.ViewBag.dssp_mua = dssp_mua;
        }
        public List<DSSP_Mua> GetDataDSSPMua()
        { 
            var KH = new KhachHang();
            if (HttpContext.Session.GetString("KH") != null)
            {
                KH = JsonConvert.DeserializeObject<KhachHang>(HttpContext.Session.GetString("KH"));
            }
            var context = new DSSP_Mua();
            var dssp_mua = context.ListDSSPMua(KH.MaKH);
            this.ViewBag.dssp_mua = dssp_mua;
            return dssp_mua;
        }
        public IActionResult DSSPMua()
        {
            KhachHang kh = DataKH();
            DataCart();
            DataDSSPMua();
            var context = new DSSP_Mua();
            List<object> ListSP = new List<object>();
            if (kh.MaKH != null && kh.MaKH > 0)
            {
                ListSP = context.ListCTSPMua(kh.MaKH) ?? new List<object>();

                Console.WriteLine($"Số lượng sản phẩm đã mua: {ListSP.Count}");
            }
            ViewData["ListSP"] = ListSP;
            return View();
        }
        public IActionResult InsertDSSPMua(DSSP_Mua dspmua)
        {
            var kh = DataKH();
            if (dspmua.MaHD > 0 && dspmua.MaTTSP > 0 && dspmua.SoLuong > 0)
            {
                var context = new DSSP_Mua();
                context.InsertDSSPMua(dspmua);
                return RedirectToAction("ListDSSPMua", new RouteValueDictionary(new { mahd = dspmua.MaHD }));
            }
            return View();
        }
        public IActionResult UpdateDSSPMua(DSSP_Mua dspmua)
        {
            var kh = DataKH();
            if (dspmua.MaHD > 0 && dspmua.MaTTSP > 0)
            {
                var context = new DSSP_Mua();
                context.UpdateDSSPMua(dspmua);
                return RedirectToAction("ListDSSPMua", new RouteValueDictionary(new { mahd = dspmua.MaHD }));
            }
            return View();
        }
    }
}
