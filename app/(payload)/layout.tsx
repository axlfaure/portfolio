/* Racine HTML de l'administration.
 *
 * Payload rend sa propre balise <html>, avec ses styles et son thème : elle ne
 * peut donc pas vivre sous la mise en page du site. D'où les deux groupes de
 * routes, `(frontend)` et `(payload)`, chacun avec sa racine. C'est aussi ce
 * qui garantit que les polices, le voile de chargement et le défilement animé
 * du site ne s'appliquent jamais à l'admin.
 *
 * Fichier de plomberie : à régénérer depuis Payload plutôt qu'à modifier. */
import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap";
import "@payloadcms/next/css";
// Après celle de Payload : elle ne fait que redéfinir des variables.
import "@/cms/styles/admin.css";

type Args = { children: React.ReactNode };

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function Layout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
