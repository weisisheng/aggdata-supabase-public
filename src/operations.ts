import {
  Scheduled,
  Communicator,
  CommunicatorContext,
  Workflow,
  WorkflowContext,
  GetApi,
  PostApi,
} from "@dbos-inc/dbos-sdk";
import { Knex } from "knex";

// https://medium.com/@sahilangrio/posting-data-to-supabase-a-quick-guide-a6bfa181fa5a
// https://medium.com/@sahilangrio/getting-started-with-supabase-how-to-fetch-data-aaf580b1373e

// Import the Supabase client
import { createClient } from "@supabase/supabase-js";
const { v4: uuidv4 } = require("uuid");

const sourceTableName = process.env["SOURCE_TABLE"]!;
const destinationTableName = process.env["DESTINATION_TABLE"]!;

export class SupabaseDataAggregator {
  // fetch data function
  @Communicator()
  static async getTestData(ctxt: CommunicatorContext) {
    // Initialize the client with your Supabase project URL and API key
    const supabase = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_ANON_KEY"]!
    );
    //
    const { count, error } = await supabase
      .from(sourceTableName)
      .select("*", { count: "exact", head: true });
    if (error) {
      console.error("Error posting data:", error);
      ctxt.logger.error("Data fetch error");
      return;
    }
    ctxt.logger.info(count);
    return count;
  }
  //
  // post data to d'base
  @Communicator()
  static async postTestData(ctxt: CommunicatorContext, data2: number) {
    // Initialize the client with your Supabase project URL and API key
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string
    );
    // Define the table where you want to post data
    const tableName = destinationTableName;
    // Define the data you want to insert
    const dataToPost = {
      id: uuidv4(),
      count: data2,
    };
    const { data, error } = await supabase.from(tableName).insert([dataToPost]);
    //
    if (error) {
      console.error("Error posting data:", error);
      return;
    }
    return data;
  }
  // system workflow
  @Workflow()
  @Scheduled({ crontab: "*/5 * * * *" })
  static async nightlyAggDataArchiver(
    ctxt: WorkflowContext,
    // these are required for cron
    schedTime: Date,
    startTime: Date
  ): Promise<string> {
    //
    ctxt.logger.info(`
        Running a workflow every 5 minutes -
          scheduled time: ${schedTime.toISOString()} /
          actual start time: ${startTime.toISOString()}
    `);
    //
    const data: number | undefined | null = await ctxt
      .invoke(SupabaseDataAggregator)
      .getTestData();
    //
    if (data === undefined || data === null) {
      ctxt.logger.info("Problem with the data retrieval");
      return "No data returned";
    }
    //
    ctxt.logger.info(`results of first fetch function: ${data}`);
    //
    // const data2 =
    await ctxt.invoke(SupabaseDataAggregator).postTestData(data);
    return "workflow completed";
  }
}
