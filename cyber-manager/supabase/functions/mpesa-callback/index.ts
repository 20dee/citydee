/// <reference lib="deno.ns" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const reply=(body:unknown)=>new Response(JSON.stringify(body),{headers:{'Content-Type':'application/json'}});
Deno.serve(async req=>{if(req.method!=='POST')return reply({ResultCode:1,ResultDesc:'POST required'});try{
 const payload=await req.json(),cb=payload?.Body?.stkCallback,checkout=cb?.CheckoutRequestID;if(!checkout)return reply({ResultCode:1,ResultDesc:'Missing checkout request ID'});
 const url=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,admin=createClient(url,service),{data:sale}=await admin.from('sales').select('id,total,payment_status').eq('mpesa_checkout_id',checkout).maybeSingle();if(!sale||sale.payment_status!=='pending')return reply({ResultCode:0,ResultDesc:'Acknowledged'});
 // Treat callback as untrusted. Independently query Daraja before changing payment status.
 const shortcode=Deno.env.get('MPESA_SHORTCODE')!,passkey=Deno.env.get('MPESA_PASSKEY')!,consumer=Deno.env.get('MPESA_CONSUMER_KEY')!,secret=Deno.env.get('MPESA_CONSUMER_SECRET')!,env=Deno.env.get('MPESA_ENV')==='production'?'https://api.safaricom.co.ke':'https://sandbox.safaricom.co.ke';
 const tokenRes=await fetch(`${env}/oauth/v1/generate?grant_type=client_credentials`,{headers:{Authorization:`Basic ${btoa(`${consumer}:${secret}`)}`}}),token=await tokenRes.json();if(!tokenRes.ok||!token.access_token)throw new Error('Daraja authentication failed');
 const timestamp=new Date().toLocaleString('en-CA',{timeZone:'Africa/Nairobi',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).replace(/[^0-9]/g,''),password=btoa(`${shortcode}${passkey}${timestamp}`);
 const verify=await fetch(`${env}/mpesa/stkpushquery/v1/query`,{method:'POST',headers:{Authorization:`Bearer ${token.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({BusinessShortCode:shortcode,Password:password,Timestamp:timestamp,CheckoutRequestID:checkout})}),result=await verify.json();if(!verify.ok)throw new Error('Daraja payment verification query failed');
 const success=String(result.ResultCode)==='0';let receipt:string|null=null;const items=cb?.CallbackMetadata?.Item||[];receipt=items.find((x:any)=>x.Name==='MpesaReceiptNumber')?.Value||null;
 const {error}=await admin.rpc('resolve_mpesa_sale',{p_sale_id:sale.id,p_paid:success,p_receipt:receipt,p_provider_result:String(result.ResultCode??'unknown')});if(error)throw error;return reply({ResultCode:0,ResultDesc:'Acknowledged'});
 }catch(e){console.error('mpesa-callback:',e);return reply({ResultCode:0,ResultDesc:'Acknowledged for retry/reconciliation'})}});
